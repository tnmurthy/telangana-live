from typing import List, Dict
from pydantic import BaseModel

class SchemeEligibility(BaseModel):
    scheme_id: str
    is_eligible: bool
    matching_criteria: List[str]
    missing_criteria: List[str]
    estimated_benefit: str

class SchemesAgent:
    def evaluate_eligibility(self, user_profile: Dict, schemes: List[Dict]) -> List[SchemeEligibility]:
        results = []
        for scheme in schemes:
            rules = scheme.get('eligibility_json', {})
            is_eligible = True
            matched = []
            missing = []
            
            # Complex logic evaluation
            for criterion, required_value in rules.items():
                user_value = user_profile.get(criterion)
                
                # Numeric comparison (e.g., income < threshold)
                if isinstance(required_value, dict) and 'max' in required_value:
                    if user_value is not None and user_value <= required_value['max']:
                        matched.append(criterion)
                    else:
                        is_eligible = False
                        missing.append(criterion)
                
                # Exact match (e.g., occupation == 'farmer')
                elif user_value == required_value:
                    matched.append(criterion)
                else:
                    is_eligible = False
                    missing.append(criterion)
            
            results.append(SchemeEligibility(
                scheme_id=scheme['id'],
                is_eligible=is_eligible,
                matching_criteria=matched,
                missing_criteria=missing,
                estimated_benefit=scheme.get('benefits', 'N/A')
            ))
            
        return results
