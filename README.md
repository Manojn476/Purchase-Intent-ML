# Purchase Intent Prediction App

This application predicts whether an online shopper is likely to make a purchase based on various features like bounce rate, exit rate, and visitor type.

## Setup

1. Install Python dependencies:
```bash
pip install pandas scikit-learn joblib
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Train the model:
```bash
python python/train_model.py
```

4. Start the server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Features

- Machine learning model using Random Forest Classifier
- Real-time predictions through a web interface
- Modern and responsive UI
- Input validation and error handling

## Input Parameters

- Product Pages: Number of product-related pages viewed
- Bounce Rate: Rate of single-page visits (0-1)
- Exit Rate: Rate of exits from the page (0-1)
- Page Value: Average value of the page
- Month: Month of the visit (0-11)
- Visitor Type: Type of visitor (Returning, New, Other)
- Weekend Visit: Whether the visit was on a weekend (Yes/No) 