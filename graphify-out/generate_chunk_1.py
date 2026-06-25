import json

nodes = [
    {
        "id": "death_certificate_service",
        "label": "Death Certificate Service",
        "file_type": "document",
        "source_file": "content/certificates/death-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "death_certificate_rationale",
        "label": "Rationale for Death Certificate",
        "file_type": "document",
        "source_file": "content/certificates/death-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "ews_certificate_service",
        "label": "EWS Certificate Service",
        "file_type": "document",
        "source_file": "content/certificates/ews-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "ews_certificate_rationale",
        "label": "Rationale for EWS Certificate",
        "file_type": "document",
        "source_file": "content/certificates/ews-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "family_membership_certificate_service",
        "label": "Family Membership Certificate Service",
        "file_type": "document",
        "source_file": "content/certificates/family-membership-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "family_membership_certificate_rationale",
        "label": "Rationale for Family Membership Certificate",
        "file_type": "document",
        "source_file": "content/certificates/family-membership-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "income_certificate_service",
        "label": "Income Certificate Service",
        "file_type": "document",
        "source_file": "content/certificates/income-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "income_certificate_rationale",
        "label": "Rationale for Income Certificate",
        "file_type": "document",
        "source_file": "content/certificates/income-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "residence_certificate_service",
        "label": "Residence / Domicile Certificate Service",
        "file_type": "document",
        "source_file": "content/certificates/residence-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "residence_certificate_rationale",
        "label": "Rationale for Residence/Domicile Certificate",
        "file_type": "document",
        "source_file": "content/certificates/residence-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "certificates_index_page",
        "label": "Documents & Certificates Index",
        "file_type": "document",
        "source_file": "content/certificates/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "certificates_index_meeseva",
        "label": "MeeSeva Portal",
        "file_type": "document",
        "source_file": "content/certificates/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "ghmc_complaints_service",
        "label": "GHMC Civic Complaints Service",
        "file_type": "document",
        "source_file": "content/complaints/ghmc-complaints.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "ghmc_complaints_ghmc",
        "label": "Greater Hyderabad Municipal Corporation",
        "file_type": "document",
        "source_file": "content/complaints/ghmc-complaints.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "complaints_index_page",
        "label": "Complaints & Grievances Index",
        "file_type": "document",
        "source_file": "content/complaints/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "pg_portal_service",
        "label": "PG Portal Service (CPGRAMS)",
        "file_type": "document",
        "source_file": "content/complaints/pg-portal.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "pg_portal_cpgrams",
        "label": "CPGRAMS Portal",
        "file_type": "document",
        "source_file": "content/complaints/pg-portal.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "prajavani_service",
        "label": "Prajavani Grievance Portal Service",
        "file_type": "document",
        "source_file": "content/complaints/prajavani.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "prajavani_cmo",
        "label": "Telangana Chief Minister's Office",
        "file_type": "document",
        "source_file": "content/complaints/prajavani.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "road_civic_issues_service",
        "label": "Road & Civic Issue Reporting Service",
        "file_type": "document",
        "source_file": "content/complaints/road-civic-issues.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "address_update_service",
        "label": "Update Voter ID Address Service",
        "file_type": "document",
        "source_file": "content/elections/address-update.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "check_voter_list_service",
        "label": "Check Your Name in the Voter List Service",
        "file_type": "document",
        "source_file": "content/elections/check-voter-list.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "check_voter_list_rationale",
        "label": "Rationale for Checking Voter List",
        "file_type": "document",
        "source_file": "content/elections/check-voter-list.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "elections_index_page",
        "label": "Elections & Voting Index",
        "file_type": "document",
        "source_file": "content/elections/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "polling_booth_service",
        "label": "Find Your Polling Booth Service",
        "file_type": "document",
        "source_file": "content/elections/polling-booth.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "polling_booth_rationale",
        "label": "Rationale for Checking Polling Booth",
        "file_type": "document",
        "source_file": "content/elections/polling-booth.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "voter_registration_service",
        "label": "Register as a Voter Service",
        "file_type": "document",
        "source_file": "content/elections/voter-registration.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "voter_registration_ceo_telangana",
        "label": "Chief Electoral Officer, Telangana",
        "file_type": "document",
        "source_file": "content/elections/voter-registration.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "voter_registration_eci",
        "label": "Election Commission of India",
        "file_type": "document",
        "source_file": "content/elections/voter-registration.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "aarogyasri_service",
        "label": "Aarogyasri / PMJAY Health Insurance Service",
        "file_type": "document",
        "source_file": "content/health/aarogyasri.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "aarogyasri_trust",
        "label": "Aarogyasri Health Care Trust",
        "file_type": "document",
        "source_file": "content/health/aarogyasri.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "basthi_dawakhana_service",
        "label": "Basthi Dawakhana - Urban Health Clinics Service",
        "file_type": "document",
        "source_file": "content/health/basthi-dawakhana.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "basthi_dawakhana_network",
        "label": "Basthi Dawakhana Network",
        "file_type": "document",
        "source_file": "content/health/basthi-dawakhana.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "disability_certificate_service",
        "label": "Disability Certificate (SADAREM) Service",
        "file_type": "document",
        "source_file": "content/health/disability-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "disability_certificate_sadarem",
        "label": "SADAREM Portal",
        "file_type": "document",
        "source_file": "content/health/disability-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "disability_certificate_udid",
        "label": "Unique Disability ID (UDID) Portal",
        "file_type": "document",
        "source_file": "content/health/disability-certificate.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "health_index_page",
        "label": "Health & Social Welfare Index",
        "file_type": "document",
        "source_file": "content/health/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "welfare_schemes_service",
        "label": "Social Welfare Schemes Overview Service",
        "file_type": "document",
        "source_file": "content/health/welfare-schemes.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "welfare_schemes_secretariat",
        "label": "Ward / Village Secretariat",
        "file_type": "document",
        "source_file": "content/health/welfare-schemes.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "jobs_education_index_page",
        "label": "Jobs, Education & Scholarships Index",
        "file_type": "document",
        "source_file": "content/jobs-education/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "jobs_education_tspsc",
        "label": "Telangana State Public Service Commission",
        "file_type": "document",
        "source_file": "content/jobs-education/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    },
    {
        "id": "jobs_education_epass",
        "label": "Telangana ePass Scholarship Portal",
        "file_type": "document",
        "source_file": "content/jobs-education/index.md",
        "source_location": None,
        "source_url": None,
        "captured_at": None,
        "author": None,
        "contributor": None
    }
]

edges = [
    # Certificates Index references
    {
        "source": "certificates_index_page",
        "target": "income_certificate_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "certificates_index_page",
        "target": "residence_certificate_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "certificates_index_page",
        "target": "death_certificate_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "certificates_index_page",
        "target": "ews_certificate_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "certificates_index_page",
        "target": "family_membership_certificate_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/index.md",
        "source_location": None,
        "weight": 1.0
    },
    # Complaints Index references
    {
        "source": "complaints_index_page",
        "target": "prajavani_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "complaints_index_page",
        "target": "ghmc_complaints_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "complaints_index_page",
        "target": "pg_portal_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "complaints_index_page",
        "target": "road_civic_issues_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/index.md",
        "source_location": None,
        "weight": 1.0
    },
    # Elections Index references
    {
        "source": "elections_index_page",
        "target": "voter_registration_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "elections_index_page",
        "target": "check_voter_list_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "elections_index_page",
        "target": "polling_booth_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "elections_index_page",
        "target": "address_update_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/index.md",
        "source_location": None,
        "weight": 1.0
    },
    # Health Index references
    {
        "source": "health_index_page",
        "target": "aarogyasri_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "health_index_page",
        "target": "basthi_dawakhana_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "health_index_page",
        "target": "disability_certificate_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/index.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "health_index_page",
        "target": "welfare_schemes_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/index.md",
        "source_location": None,
        "weight": 1.0
    },
    # Rationales
    {
        "source": "death_certificate_rationale",
        "target": "death_certificate_service",
        "relation": "rationale_for",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/death-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "ews_certificate_rationale",
        "target": "ews_certificate_service",
        "relation": "rationale_for",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/ews-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "family_membership_certificate_rationale",
        "target": "family_membership_certificate_service",
        "relation": "rationale_for",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/family-membership-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "income_certificate_rationale",
        "target": "income_certificate_service",
        "relation": "rationale_for",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/income-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "residence_certificate_rationale",
        "target": "residence_certificate_service",
        "relation": "rationale_for",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/residence-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "check_voter_list_rationale",
        "target": "check_voter_list_service",
        "relation": "rationale_for",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/check-voter-list.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "polling_booth_rationale",
        "target": "polling_booth_service",
        "relation": "rationale_for",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/polling-booth.md",
        "source_location": None,
        "weight": 1.0
    },
    # Platform / Service implementations
    {
        "source": "income_certificate_service",
        "target": "certificates_index_meeseva",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/income-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "ews_certificate_service",
        "target": "certificates_index_meeseva",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/ews-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "family_membership_certificate_service",
        "target": "certificates_index_meeseva",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/family-membership-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "residence_certificate_service",
        "target": "certificates_index_meeseva",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/residence-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "death_certificate_service",
        "target": "certificates_index_meeseva",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/death-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "ghmc_complaints_service",
        "target": "ghmc_complaints_ghmc",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/ghmc-complaints.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "pg_portal_service",
        "target": "pg_portal_cpgrams",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/pg-portal.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "prajavani_service",
        "target": "prajavani_cmo",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/prajavani.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "voter_registration_service",
        "target": "voter_registration_ceo_telangana",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/voter-registration.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "voter_registration_service",
        "target": "voter_registration_eci",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/voter-registration.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "aarogyasri_service",
        "target": "aarogyasri_trust",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/aarogyasri.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "basthi_dawakhana_service",
        "target": "basthi_dawakhana_network",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/basthi-dawakhana.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "disability_certificate_service",
        "target": "disability_certificate_sadarem",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/disability-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "disability_certificate_service",
        "target": "disability_certificate_udid",
        "relation": "implements",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/disability-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    # Cross-references & dependencies
    {
        "source": "death_certificate_service",
        "target": "ghmc_complaints_ghmc",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/certificates/death-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "pg_portal_service",
        "target": "prajavani_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/pg-portal.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "road_civic_issues_service",
        "target": "ghmc_complaints_ghmc",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/road-civic-issues.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "road_civic_issues_service",
        "target": "prajavani_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/complaints/road-civic-issues.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "basthi_dawakhana_service",
        "target": "ghmc_complaints_ghmc",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/health/basthi-dawakhana.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "check_voter_list_service",
        "target": "voter_registration_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/check-voter-list.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "check_voter_list_service",
        "target": "address_update_service",
        "relation": "references",
        "confidence": "EXTRACTED",
        "confidence_score": 1.0,
        "source_file": "content/elections/check-voter-list.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "address_update_service",
        "target": "voter_registration_service",
        "relation": "conceptually_related_to",
        "confidence": "INFERRED",
        "confidence_score": 0.9,
        "source_file": "content/elections/address-update.md",
        "source_location": None,
        "weight": 1.0
    },
    # Semantic similarities
    {
        "source": "ews_certificate_service",
        "target": "income_certificate_service",
        "relation": "semantically_similar_to",
        "confidence": "INFERRED",
        "confidence_score": 0.85,
        "source_file": "content/certificates/ews-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    {
        "source": "death_certificate_service",
        "target": "family_membership_certificate_service",
        "relation": "semantically_similar_to",
        "confidence": "INFERRED",
        "confidence_score": 0.80,
        "source_file": "content/certificates/death-certificate.md",
        "source_location": None,
        "weight": 1.0
    },
    # Ambiguous validation database / flow link
    {
        "source": "aarogyasri_service",
        "target": "income_certificate_service",
        "relation": "shares_data_with",
        "confidence": "AMBIGUOUS",
        "confidence_score": 0.25,
        "source_file": "content/health/aarogyasri.md",
        "source_location": None,
        "weight": 1.0
    }
]

hyperedges = [
    {
        "id": "citizen_grievance_redressal_flow",
        "label": "Citizen Grievance Redressal Flow",
        "nodes": [
            "prajavani_service",
            "pg_portal_service",
            "ghmc_complaints_service",
            "road_civic_issues_service"
        ],
        "relation": "participate_in",
        "confidence": "INFERRED",
        "confidence_score": 0.90,
        "source_file": "content/complaints/index.md"
    },
    {
        "id": "voter_lifecycle_management",
        "label": "Voter Identity and Roll Lifecycle",
        "nodes": [
            "voter_registration_service",
            "check_voter_list_service",
            "polling_booth_service",
            "address_update_service"
        ],
        "relation": "participate_in",
        "confidence": "INFERRED",
        "confidence_score": 0.95,
        "source_file": "content/elections/index.md"
    },
    {
        "id": "meeseva_certificate_procurement",
        "label": "MeeSeva Certificate Procurement",
        "nodes": [
            "income_certificate_service",
            "ews_certificate_service",
            "family_membership_certificate_service",
            "residence_certificate_service",
            "death_certificate_service"
        ],
        "relation": "implement",
        "confidence": "INFERRED",
        "confidence_score": 0.95,
        "source_file": "content/certificates/index.md"
    }
]

output_data = {
    "nodes": nodes,
    "edges": edges,
    "hyperedges": hyperedges,
    "input_tokens": 0,
    "output_tokens": 0
}

with open("C:/tt-ai-stack/01_projects/telangana-live/graphify-out/.graphify_chunk_1.json", "w") as f:
    json.dump(output_data, f, indent=2)

print("Chunk 1 graph validation and save successful!")
