import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Create model directory if it doesn't exist
os.makedirs('../model', exist_ok=True)

# Load and preprocess data
df = pd.read_csv('online_shoppers_intention.csv')

# Encode categories
df['VisitorType'] = LabelEncoder().fit_transform(df['VisitorType'])
df['Month'] = LabelEncoder().fit_transform(df['Month'])
df['Weekend'] = df['Weekend'].astype(int)

# Select features for prediction
features = [
    'Administrative', 'Administrative_Duration',
    'Informational', 'Informational_Duration',
    'ProductRelated', 'ProductRelated_Duration',
    'BounceRates', 'ExitRates', 'PageValues',
    'SpecialDay', 'Month', 'OperatingSystems',
    'Browser', 'Region', 'TrafficType',
    'VisitorType', 'Weekend'
]

X = df[features]
y = df['Revenue'].astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Get feature importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
})
feature_importance = feature_importance.sort_values('importance', ascending=False)

# Select top 8 most important features
top_features = feature_importance.head(8)['feature'].tolist()
print("\nTop 8 most important features:")
print(feature_importance.head(8))

# Retrain model with only top features
X = df[top_features]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and feature list
joblib.dump(model, '../model/purchase_model.pkl')
joblib.dump(top_features, '../model/selected_features.pkl')

print("\nModel trained and saved successfully!") 