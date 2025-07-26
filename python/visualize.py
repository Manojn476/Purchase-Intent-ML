import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from matplotlib.figure import Figure
import numpy as np
import os

def generate_visualizations():
    try:
        # Create static directory if it doesn't exist
        os.makedirs('static', exist_ok=True)
        
        # Read the dataset
        df = pd.read_csv('online_shoppers_intention.csv')
        
        # Create a figure with subplots
        fig = plt.figure(figsize=(20, 15))
        plt.style.use('default')  # Use default style instead of seaborn
        
        # 1. Purchase Distribution (Pie Chart)
        plt.subplot(2, 2, 1)
        purchase_counts = df['Revenue'].value_counts()
        plt.pie(purchase_counts, labels=['No Purchase', 'Purchase'], autopct='%1.1f%%', colors=['#ff9999','#66b3ff'])
        plt.title('Purchase Distribution')
        
        # 2. Page Views Distribution (Histogram)
        plt.subplot(2, 2, 2)
        sns.histplot(data=df, x='ProductRelated', bins=30)
        plt.title('Product Page Views Distribution')
        plt.xlabel('Number of Product Pages Viewed')
        plt.ylabel('Count')
        
        # 3. Bounce Rate vs Exit Rate (Scatter Plot)
        plt.subplot(2, 2, 3)
        sns.scatterplot(data=df, x='BounceRates', y='ExitRates', hue='Revenue', alpha=0.5)
        plt.title('Bounce Rate vs Exit Rate')
        plt.xlabel('Bounce Rate')
        plt.ylabel('Exit Rate')
        
        # 4. Average Page Value by Visitor Type (Bar Chart)
        plt.subplot(2, 2, 4)
        visitor_page_value = df.groupby('VisitorType')['PageValues'].mean()
        visitor_page_value.plot(kind='bar')
        plt.title('Average Page Value by Visitor Type')
        plt.xlabel('Visitor Type')
        plt.ylabel('Average Page Value')
        plt.xticks(rotation=45)
        
        # 5. Duration Distribution (Box Plot)
        plt.figure(figsize=(20, 15))
        plt.subplot(2, 2, 1)
        sns.boxplot(data=df, x='Revenue', y='ProductRelated_Duration')
        plt.title('Product Related Duration Distribution')
        plt.xlabel('Purchase Made')
        plt.ylabel('Duration (seconds)')
        
        # 6. Weekend vs Weekday Purchase Rate (Bar Chart)
        plt.subplot(2, 2, 2)
        weekend_purchase = df.groupby('Weekend')['Revenue'].mean()
        weekend_purchase.plot(kind='bar')
        plt.title('Purchase Rate: Weekend vs Weekday')
        plt.xlabel('Weekend')
        plt.ylabel('Purchase Rate')
        plt.xticks([0, 1], ['Weekday', 'Weekend'])
        
        # 7. Month-wise Purchase Distribution (Line Chart)
        plt.subplot(2, 2, 3)
        monthly_purchase = df.groupby('Month')['Revenue'].mean()
        monthly_purchase.plot(kind='line', marker='o')
        plt.title('Monthly Purchase Rate')
        plt.xlabel('Month')
        plt.ylabel('Purchase Rate')
        
        # 8. Correlation Heatmap
        plt.subplot(2, 2, 4)
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        correlation = df[numeric_cols].corr()
        sns.heatmap(correlation, annot=True, cmap='coolwarm', fmt='.2f')
        plt.title('Feature Correlation Heatmap')
        
        # Save the plots
        plt.tight_layout()
        plt.savefig('static/visualizations.png')
        plt.close()
        return True
    except Exception as e:
        print(f"Error generating visualizations: {str(e)}")
        return False

if __name__ == "__main__":
    success = generate_visualizations()
    if not success:
        exit(1) 