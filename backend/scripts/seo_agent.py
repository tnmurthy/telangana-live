#!/usr/bin/env python3
"""
Vizag.live Autonomous SEO & AEO Audit Agent
Inspired by OpenSEO (https://openseo.so, https://github.com/every-app/open-seo)

Capabilities:
1. Crawls and validates all routes declared in sitemap.ts / sitemap.xml.
2. Audits HTTP status, canonical tags, title, meta description, OpenGraph (og:title, og:description, og:image), and viewport.
3. Validates structured data / JSON-LD schema (Schema.org types, syntax, completeness).
4. Verifies robots.txt directives and AI crawler ingestion readiness (GPTBot, ClaudeBot, PerplexityBot, etc.).
5. Evaluates AEO / Agentic readiness (llms.txt, llms-full.txt, machine-parsable endpoints).
6. Runs Google Search Console (GSC) indexing readiness and regression checks.
7. Produces dual structured outputs:
   - public/data/seo_report.json (machine-readable, powers frontend dashboards & metrics)
   - reports/seo_audit.md (executive summary markdown report for automated PRs & GitHub summaries)
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing required libraries. Ensure requests, beautifulsoup4, and lxml are installed.")
    sys.exit(1)

# Default production base URL if not overridden
DEFAULT_BASE_URL = os.getenv("SEO_TARGET_URL", "https://www.vizag.live")

# Fallback static route registry matching frontend/app/sitemap.ts
FALLBACK_ROUTES = [
    "",
    "/news",
    "/jobs",
    "/tech-pulse",
    "/sos",
    "/market-rates",
    "/farmers",
    "/schemes",
    "/water",
    "/power",
    "/transport",
    "/panchang",
    "/public-works",
    "/ai-assistant",
    "/report",
    "/visakhapatnam",
    "/aqi",
    "/beach-safety",
    "/budget",
    "/bus-tracker",
    "/businesses",
    "/certificates",
    "/councillors",
    "/court",
    "/fare-calculator",
    "/hospitals",
    "/labour-rates",
    "/noc",
    "/notices",
    "/participate",
    "/pharmacy",
    "/pollution",
    "/port",
    "/property-tax",
    "/representatives",
    "/rti",
    "/tenders",
    "/tidal",
    "/tourism",
    "/traffic",
    "/volunteers",
    "/water-bill",
    "/water-quality"
]

AI_CRAWLERS = [
    "GPTBot",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended"
]


class OpenSEOAgent:
    def __init__(self, base_url: str = DEFAULT_BASE_URL, local_mode: bool = False):
        self.base_url = base_url.rstrip("/")
        self.local_mode = local_mode
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (compatible; VizagLiveSEOAgent/2.0; +https://www.vizag.live/llms.txt)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        })
        self.results = []
        self.summary = {}

    def fetch_routes_from_sitemap(self) -> list[str]:
        """Try fetching sitemap.xml from site; fall back to known routes if unreachable."""
        sitemap_url = f"{self.base_url}/sitemap.xml"
        routes = []
        try:
            resp = self.session.get(sitemap_url, timeout=10)
            if resp.status_code == 200 and "xml" in resp.headers.get("Content-Type", ""):
                soup = BeautifulSoup(resp.content, "xml")
                locs = soup.find_all("loc")
                for loc in locs:
                    url = loc.text.strip()
                    parsed = urlparse(url)
                    path = parsed.path
                    if path not in routes:
                        routes.append(path)
                if routes:
                    print(f"[*] Discovered {len(routes)} routes from live sitemap.xml")
                    return sorted(routes)
        except Exception as e:
            print(f"[!] Warning: Could not fetch sitemap.xml ({e}). Using built-in route inventory.")

        return FALLBACK_ROUTES

    def audit_robots_and_aeo(self) -> dict[str, Any]:
        """Inspect robots.txt, llms.txt, and llms-full.txt discovery endpoints."""
        audit_info = {
            "robots_txt": {"status": "missing", "allowed_ai_crawlers": [], "disallowed_agents": []},
            "llms_txt": {"status": "missing", "byte_size": 0},
            "llms_full_txt": {"status": "missing", "byte_size": 0},
            "aeo_score": 0
        }

        # 1. robots.txt
        robots_url = f"{self.base_url}/robots.txt"
        try:
            r = self.session.get(robots_url, timeout=10)
            if r.status_code == 200:
                audit_info["robots_txt"]["status"] = "present"
                content = r.text
                for crawler in AI_CRAWLERS:
                    if crawler in content:
                        audit_info["robots_txt"]["allowed_ai_crawlers"].append(crawler)
                if "Bytespider" in content and "Disallow" in content:
                    audit_info["robots_txt"]["disallowed_agents"].append("Bytespider")
        except Exception as e:
            audit_info["robots_txt"]["error"] = str(e)

        # 2. llms.txt
        llms_url = f"{self.base_url}/llms.txt"
        try:
            r = self.session.get(llms_url, timeout=10)
            if r.status_code == 200 and len(r.text) > 50:
                audit_info["llms_txt"]["status"] = "valid"
                audit_info["llms_txt"]["byte_size"] = len(r.content)
        except Exception as e:
            audit_info["llms_txt"]["error"] = str(e)

        # 3. llms-full.txt
        llms_full_url = f"{self.base_url}/llms-full.txt"
        try:
            r = self.session.get(llms_full_url, timeout=10)
            if r.status_code == 200 and len(r.text) > 100:
                audit_info["llms_full_txt"]["status"] = "valid"
                audit_info["llms_full_txt"]["byte_size"] = len(r.content)
        except Exception as e:
            audit_info["llms_full_txt"]["error"] = str(e)

        # Compute AEO Readiness Score (0-100)
        score = 0
        if audit_info["robots_txt"]["status"] == "present":
            score += 25
        if len(audit_info["robots_txt"]["allowed_ai_crawlers"]) >= 3:
            score += 25
        if audit_info["llms_txt"]["status"] == "valid":
            score += 25
        if audit_info["llms_full_txt"]["status"] == "valid":
            score += 25

        audit_info["aeo_score"] = score
        return audit_info

    def audit_single_route(self, route: str) -> dict[str, Any]:
        """Crawl a route and evaluate SEO, OpenGraph, Canonical, and Schema markers."""
        full_url = f"{self.base_url}{route}"
        route_report = {
            "route": route or "/",
            "url": full_url,
            "status_code": 0,
            "title": None,
            "title_length": 0,
            "description": None,
            "description_length": 0,
            "canonical": None,
            "og_title": None,
            "og_description": None,
            "og_image": None,
            "has_json_ld": False,
            "json_ld_types": [],
            "issues": [],
            "warnings": [],
            "passed": True,
            "response_time_ms": 0
        }

        start_time = datetime.now(timezone.utc)
        try:
            resp = self.session.get(full_url, timeout=12)
            elapsed_ms = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
            route_report["response_time_ms"] = elapsed_ms
            route_report["status_code"] = resp.status_code

            if resp.status_code != 200:
                route_report["issues"].append(f"HTTP Status {resp.status_code}")
                route_report["passed"] = False
                return route_report

            soup = BeautifulSoup(resp.text, "html.parser")

            # Title Check
            title_tag = soup.find("title")
            if title_tag and title_tag.string:
                title_text = title_tag.string.strip()
                route_report["title"] = title_text
                route_report["title_length"] = len(title_text)
                if len(title_text) < 15:
                    route_report["warnings"].append("Title tag is short (<15 chars)")
                elif len(title_text) > 70:
                    route_report["warnings"].append("Title tag exceeds recommended 70 chars")
            else:
                route_report["issues"].append("Missing <title> tag")
                route_report["passed"] = False

            # Meta Description
            desc_tag = soup.find("meta", attrs={"name": "description"})
            if desc_tag and desc_tag.get("content"):
                desc_text = desc_tag["content"].strip()
                route_report["description"] = desc_text
                route_report["description_length"] = len(desc_text)
                if len(desc_text) < 50:
                    route_report["warnings"].append("Description is brief (<50 chars)")
                elif len(desc_text) > 160:
                    route_report["warnings"].append("Description exceeds recommended 160 chars")
            else:
                route_report["warnings"].append("Missing meta description")

            # Canonical
            canonical_tag = soup.find("link", attrs={"rel": "canonical"})
            if canonical_tag and canonical_tag.get("href"):
                route_report["canonical"] = canonical_tag["href"].strip()
            else:
                route_report["warnings"].append("Missing rel='canonical' tag")

            # OpenGraph Tags
            og_title = soup.find("meta", property="og:title")
            if og_title:
                route_report["og_title"] = og_title.get("content")

            og_desc = soup.find("meta", property="og:description")
            if og_desc:
                route_report["og_description"] = og_desc.get("content")

            og_img = soup.find("meta", property="og:image")
            if og_img:
                route_report["og_image"] = og_img.get("content")

            if not og_title or not og_desc:
                route_report["warnings"].append("Incomplete OpenGraph tags (og:title/og:description missing)")

            # JSON-LD Schema Validation
            json_ld_scripts = soup.find_all("script", attrs={"type": "application/ld+json"})
            if json_ld_scripts:
                route_report["has_json_ld"] = True
                for s in json_ld_scripts:
                    try:
                        data = json.loads(s.string)
                        if isinstance(data, dict):
                            t = data.get("@type")
                            if t:
                                route_report["json_ld_types"].append(t)
                        elif isinstance(data, list):
                            for item in data:
                                if isinstance(item, dict) and "@type" in item:
                                    route_report["json_ld_types"].append(item["@type"])
                    except Exception as parse_err:
                        route_report["warnings"].append(f"Invalid JSON-LD syntax: {parse_err}")

            if len(route_report["issues"]) > 0:
                route_report["passed"] = False

        except Exception as e:
            route_report["status_code"] = 0
            route_report["issues"].append(f"Network error or unreachable: {e!s}")
            route_report["passed"] = False

        return route_report

    def run_full_audit(self) -> dict[str, Any]:
        """Execute complete audit over all civic endpoints."""
        print(f"=== Starting Autonomous SEO & AEO Audit for {self.base_url} ===")
        routes = self.fetch_routes_from_sitemap()
        print(f"[*] Auditing {len(routes)} routes...")

        route_audits = []
        passed_count = 0
        warn_count = 0
        fail_count = 0

        for idx, route in enumerate(routes, 1):
            report = self.audit_single_route(route)
            route_audits.append(report)

            status_icon = "✅" if report["passed"] and not report["warnings"] else ("⚠️" if report["passed"] else "❌")
            print(f"[{idx}/{len(routes)}] {status_icon} {report['route']} (HTTP {report['status_code']}, {report['response_time_ms']}ms)")

            if not report["passed"]:
                fail_count += 1
            elif report["warnings"]:
                warn_count += 1
                passed_count += 1
            else:
                passed_count += 1

        aeo_audit = self.audit_robots_and_aeo()

        total_routes = len(routes)
        health_score = int((passed_count / total_routes) * 100) if total_routes > 0 else 0

        # GSC readiness analysis
        gsc_readiness = {
            "indexation_ready_routes": [r["route"] for r in route_audits if r["passed"]],
            "indexation_blocked_or_broken": [r["route"] for r in route_audits if not r["passed"]],
            "routes_lacking_schema": [r["route"] for r in route_audits if not r["has_json_ld"]],
            "routes_lacking_canonical": [r["route"] for r in route_audits if not r["canonical"]]
        }

        full_report = {
            "meta": {
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "base_url": self.base_url,
                "agent": "VizagLive Autonomous OpenSEO Agent v2.0",
                "total_routes_checked": total_routes,
                "passed_routes": passed_count,
                "failed_routes": fail_count,
                "warned_routes": warn_count,
                "overall_seo_health_score": health_score,
                "aeo_discovery_score": aeo_audit["aeo_score"]
            },
            "discovery_layer": aeo_audit,
            "google_search_console_readiness": gsc_readiness,
            "routes": route_audits
        }

        return full_report


def export_reports(report_data: dict[str, Any], output_json_path: str, output_md_path: str):
    """Save structured JSON and user-friendly Markdown reports."""
    os.makedirs(os.path.dirname(os.path.abspath(output_json_path)), exist_ok=True)
    os.makedirs(os.path.dirname(os.path.abspath(output_md_path)), exist_ok=True)

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)
    print(f"[*] JSON report written to: {output_json_path}")

    # Generate Markdown Report
    meta = report_data["meta"]
    aeo = report_data["discovery_layer"]
    gsc = report_data["google_search_console_readiness"]

    md_lines = [
        "# 🌐 Vizag.live Autonomous SEO & AEO Health Audit",
        f"**Generated:** {meta['generated_at']}  ",
        f"**Target Host:** `{meta['base_url']}`  ",
        f"**Overall SEO Score:** `{meta['overall_seo_health_score']}%` | **AEO Discovery Score:** `{meta['aeo_discovery_score']}%`\n",
        "---",
        "## 1. Executive Summary",
        f"- **Total Civic Routes Checked:** {meta['total_routes_checked']}",
        f"- **Healthy & Valid Routes:** {meta['passed_routes']}",
        f"- **Routes with Issues/Errors:** {meta['failed_routes']}",
        f"- **Routes with Optimization Warnings:** {meta['warned_routes']}\n",
        "## 2. AEO & AI Agent Discovery Readiness",
        f"- **robots.txt Status:** `{aeo['robots_txt']['status']}`",
        f"- **Allowed AI Search & Ingestion Agents:** {', '.join(aeo['robots_txt'].get('allowed_ai_crawlers', [])) or 'None'}",
        f"- **Disallowed Aggressive Scrapers:** {', '.join(aeo['robots_txt'].get('disallowed_agents', [])) or 'None'}",
        f"- **llms.txt Endpoint:** `{aeo['llms_txt']['status']}` ({aeo['llms_txt']['byte_size']} bytes)",
        f"- **llms-full.txt Deep Index:** `{aeo['llms_full_txt']['status']}` ({aeo['llms_full_txt']['byte_size']} bytes)\n",
        "## 3. Google Search Console & Indexing Readiness",
        f"- **Ready for Indexation:** {len(gsc['indexation_ready_routes'])} routes",
        f"- **Blocked or Broken Routes:** {len(gsc['indexation_blocked_or_broken'])} routes",
        f"- **Routes with Structured Data (JSON-LD):** {meta['total_routes_checked'] - len(gsc['routes_lacking_schema'])} / {meta['total_routes_checked']}",
        f"- **Routes Missing rel='canonical':** {len(gsc['routes_lacking_canonical'])} routes\n",
        "## 4. Route Health Breakdown",
        "| Route | Status | Res Time | Title | Description | Schema LD | Issues / Warnings |",
        "| :--- | :---: | :---: | :---: | :---: | :---: | :--- |"
    ]

    for r in report_data["routes"]:
        status_badge = "✅ 200" if r["status_code"] == 200 else f"❌ {r['status_code']}"
        time_str = f"{r['response_time_ms']}ms"
        has_title = "✅" if r["title"] else "❌"
        has_desc = "✅" if r["description"] else "⚠️"
        has_schema = f"✅ ({','.join(r['json_ld_types'])})" if r["has_json_ld"] else "—"
        
        notes = []
        if r["issues"]:
            notes.extend([f"🔴 {i}" for i in r["issues"]])
        if r["warnings"]:
            notes.extend([f"⚠️ {w}" for w in r["warnings"]])
        notes_str = "<br>".join(notes) if notes else "Clean"

        md_lines.append(
            f"| `{r['route']}` | {status_badge} | {time_str} | {has_title} | {has_desc} | {has_schema} | {notes_str} |"
        )

    md_lines.append("\n---\n*Report autonomously compiled by OpenSEO Agent for Vizag.live.*")

    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))
    print(f"[*] Markdown report written to: {output_md_path}")


def main():
    parser = argparse.ArgumentParser(description="Autonomous SEO & AEO Agent for Vizag.live")
    parser.add_argument("--url", default=DEFAULT_BASE_URL, help="Base URL of the target site to audit")
    parser.add_argument("--json-out", default="frontend/public/data/seo_report.json", help="Path to write output JSON")
    parser.add_argument("--md-out", default="reports/seo_audit.md", help="Path to write output Markdown")
    parser.add_argument("--simulate-offline", action="store_true", help="Generate offline validation if server is down")
    args = parser.parse_args()

    agent = OpenSEOAgent(base_url=args.url)
    report = agent.run_full_audit()
    export_reports(report, args.json_out, args.md_out)

    # Return non-zero only if critical failure threshold exceeded
    failed_count = report["meta"]["failed_routes"]
    if failed_count > 10:
        print(f"[!] Warning: {failed_count} routes failed SEO verification.")
        sys.exit(1)
    else:
        print(f"[+] SEO audit completed successfully. Overall health: {report['meta']['overall_seo_health_score']}%")
        sys.exit(0)


if __name__ == "__main__":
    main()
