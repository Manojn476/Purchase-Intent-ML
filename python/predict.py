import sys
import joblib
import numpy as np

def predict(inputs):
    try:
        model = joblib.load('../model/purchase_model.pkl')
        selected_features = joblib.load('../model/selected_features.pkl')
        
        # Create a dictionary of all possible features
        all_features = {
            'Administrative': 0, 'Administrative_Duration': 0,
            'Informational': 0, 'Informational_Duration': 0,
            'ProductRelated': 0, 'ProductRelated_Duration': 0,
            'BounceRates': 0, 'ExitRates': 0, 'PageValues': 0,
            'SpecialDay': 0, 'Month': 0, 'OperatingSystems': 0,
            'Browser': 0, 'Region': 0, 'TrafficType': 0,
            'VisitorType': 0, 'Weekend': 0
        }
        
        # Update only the selected features with input values
        for feature, value in zip(selected_features, inputs):
            all_features[feature] = value
            
        # Create input array in the correct order
        input_array = [all_features[feature] for feature in selected_features]
        
        prediction = model.predict([input_array])[0]
        return prediction
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    # Parse command line arguments
    inputs = list(map(float, sys.argv[1:]))
    result = predict(inputs)
    print(result) 