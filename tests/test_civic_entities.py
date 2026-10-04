"""
TL-15: one civic-entity keyword table.

core/news_classifier.py kept its own copy of the keyword table in
core/correlation_engine.py; the two drifted (different keywords, and fuel
mapped to ("fuel_price", "petrol") in one and "fuel" in the other) and
matched differently (substring vs whole word). The classifier now derives
from ENTITY_MAPPING_RULES.

Run with:  pytest tests/test_civic_entities.py
"""
import inspect
import os
import sys

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend"))

from core import correlation_engine, news_classifier  # noqa: E402
from core.correlation_engine import ENTITY_MAPPING_RULES, map_article_to_civic_entities  # noqa: E402
from core.news_classifier import extract_entities, map_domain_to_civic_schema  # noqa: E402


def test_classifier_has_no_keyword_table_of_its_own():
    source = inspect.getsource(news_classifier.extract_entities)
    assert '"Red Line": [' not in source and "mappings = {" not in source


def test_classifier_finds_the_same_entities_as_the_correlation_engine():
    title = "Gold price rises in Hyderabad as Srisailam inflows fall"
    desc = "Petrol price steady; paddy procurement begins in Nalgonda."
    labels = extract_entities(title, desc)["domain_entities"]
    pairs = {map_domain_to_civic_schema(label) for label in labels}
    expected = {(m["entity_type"], m["entity_id"]) for m in map_article_to_civic_entities(title, desc)}
    assert pairs == expected


def test_existing_label_names_are_kept():
    labels = extract_entities("Gold rate and Nagarjuna Sagar levels in Hyderabad", "")["domain_entities"]
    assert {"Gold", "Nagarjuna Sagar", "Hyderabad District"} <= set(labels)


def test_every_table_entry_round_trips_through_its_label():
    for entity_type, entities in ENTITY_MAPPING_RULES.items():
        for entity_id in entities:
            label = news_classifier.entity_label(entity_type, entity_id)
            assert map_domain_to_civic_schema(label) == (entity_type, entity_id)


def test_fuel_label_maps_to_the_id_the_site_queries():
    assert map_domain_to_civic_schema("Fuel") == ("fuel_price", "fuel")


def test_matching_is_whole_word():
    # Substring matching tagged "kapass" or "goldrate" style fragments.
    assert extract_entities("Medakpally residents protest", "")["domain_entities"] == []


def test_unknown_label_maps_to_nothing():
    assert map_domain_to_civic_schema("Atlantis") == (None, None)
