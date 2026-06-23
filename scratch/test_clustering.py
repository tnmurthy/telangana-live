import sys
import os

# Put backend folder in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from core.clustering import cluster_articles, jaccard_similarity, cosine_similarity

def test_jaccard():
    print("Testing Jaccard Similarity Fallback...")
    s1 = "Hyderabad Metro services delayed due to technical glitch"
    s2 = "Metro services in Hyderabad delayed because of signal issue"
    s3 = "Gold prices surge in Hyderabad market today"
    
    sim1 = jaccard_similarity(s1, s2)
    sim2 = jaccard_similarity(s1, s3)
    
    print(f"Similarity (Metro vs Metro): {sim1:.4f}")
    print(f"Similarity (Metro vs Gold): {sim2:.4f}")
    assert sim1 > 0.30, "Expected Metro articles to have similarity > 0.30"
    assert sim2 < 0.30, "Expected Metro and Gold articles to have similarity < 0.30"
    print("Jaccard Similarity test passed!\n")

def test_clustering_workflow():
    print("Testing Clustering Workflow...")
    mock_articles = [
        {
            "title": "Hyderabad Metro services delayed due to technical glitch",
            "description": "Passengers faced inconvenience on Monday morning as services on the Red Line were delayed.",
            "source": "Telangana Today",
            "link": "https://telanganatoday.com/metro-delayed"
        },
        {
            "title": "Metro services in Hyderabad delayed because of signal issue",
            "description": "A technical snag near Ameerpet station caused delays on the Hyderabad Metro corridor.",
            "source": "The Hindu",
            "link": "https://thehindu.com/metro-delay"
        },
        {
            "title": "Gold prices surge in Hyderabad market today",
            "description": "Gold rates increased by Rs 200 per 10 grams in Hyderabad markets on Monday.",
            "source": "Telangana Today",
            "link": "https://telanganatoday.com/gold-price"
        }
    ]
    
    clustered = cluster_articles(mock_articles, jaccard_threshold=0.30)
    print(f"Original articles count: {len(mock_articles)}")
    print(f"Clustered articles count: {len(clustered)}")
    
    for c in clustered:
        print(f"\nRepresentative: {c['title']} ({c['source']})")
        if c.get("other_sources"):
            print(f"  Alternative Coverage:")
            for other in c["other_sources"]:
                print(f"    - {other['source']}: {other['link']}")
                
    assert len(clustered) == 2, f"Expected 2 clusters, got {len(clustered)}"
    assert len(clustered[0]["other_sources"]) == 1, "Expected 1 alternative source for the first cluster"
    assert clustered[0]["other_sources"][0]["source"] == "The Hindu", "Expected The Hindu to be the alternative source"
    print("Clustering Workflow test passed!\n")

if __name__ == "__main__":
    try:
        test_jaccard()
        test_clustering_workflow()
        print("All tests completed successfully!")
    except AssertionError as e:
        print(f"Assertion failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Test failed with error: {e}")
        sys.exit(1)
