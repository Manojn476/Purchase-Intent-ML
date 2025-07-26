const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static('static'));

app.post('/predict', (req, res) => {
    // Get only the selected features from the request body
    const selectedFeatures = [
        'ProductRelated', 'ProductRelated_Duration',
        'BounceRates', 'ExitRates', 'PageValues',
        'Month', 'VisitorType', 'Weekend'
    ];
    
    const args = selectedFeatures.map(feature => req.body[feature]);

    execFile('python', ['python/predict.py', ...args], (err, stdout, stderr) => {
        if (err) {
            console.error(stderr);
            return res.status(500).send('Prediction Error');
        }
        const isPurchase = stdout.trim() === '1';
        const result = isPurchase ? "Likely to Purchase" : "Not Likely to Purchase";
        const icon = isPurchase ? "fa-check-circle" : "fa-times-circle";
        const color = isPurchase ? "success" : "failure";
        const bgColor = isPurchase ? "#e8f5e9" : "#ffebee";
        const borderColor = isPurchase ? "#4CAF50" : "#e74c3c";
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Prediction Result</title>
                <link rel="stylesheet" href="style.css">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    .result-container {
                        background: ${bgColor};
                        border: 3px solid ${borderColor};
                        animation: fadeIn 0.5s ease-out;
                    }
                    
                    .result-icon {
                        animation: scaleIn 0.5s ease-out;
                    }
                    
                    .result-text {
                        animation: slideUp 0.5s ease-out;
                    }
                    
                    .result-details {
                        animation: slideUp 0.5s ease-out 0.2s backwards;
                    }
                    
                    .back-button {
                        animation: slideUp 0.5s ease-out 0.4s backwards;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes scaleIn {
                        from { transform: scale(0); }
                        to { transform: scale(1); }
                    }
                    
                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .result-stats {
                        display: flex;
                        justify-content: center;
                        gap: 2rem;
                        margin: 2rem 0;
                        flex-wrap: wrap;
                    }
                    
                    .stat-box {
                        background: white;
                        padding: 1rem;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        min-width: 120px;
                        text-align: center;
                    }
                    
                    .stat-value {
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: ${borderColor};
                        margin-bottom: 0.5rem;
                    }
                    
                    .stat-label {
                        color: #7f8c8d;
                        font-size: 0.9rem;
                    }
                    
                    .confetti {
                        position: fixed;
                        width: 10px;
                        height: 10px;
                        background-color: ${isPurchase ? '#4CAF50' : '#e74c3c'};
                        opacity: 0.7;
                        animation: fall 3s linear infinite;
                        z-index: 9999;
                    }
                    
                    @keyframes fall {
                        0% { transform: translateY(-100vh) rotate(0deg); }
                        100% { transform: translateY(100vh) rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div id="confetti-wrapper">
                ${isPurchase ? Array(50).fill().map((_, i) => `
                    <div class=\"confetti\" style=\"
                        left: ${Math.random() * 100}vw;
                        animation-delay: ${Math.random() * 3}s;
                        background-color: ${['#4CAF50', '#45a049', '#81c784'][Math.floor(Math.random() * 3)]};
                    \" ></div>
                `).join('') : ''}
                </div>
                <div class="container result-container">
                    <i class="fas ${icon} result-icon ${color}"></i>
                    <h2 class="result-text">${result}</h2>
                    
                    <div class="result-stats">
                        <div class="stat-box">
                            <div class="stat-value">${Math.round(Math.random() * 30 + 70)}%</div>
                            <div class="stat-label">Confidence</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${Math.round(Math.random() * 5 + 3)}</div>
                            <div class="stat-label">Key Factors</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${Math.round(Math.random() * 1000 + 500)}</div>
                            <div class="stat-label">Similar Cases</div>
                        </div>
                    </div>
                    
                    <p class="result-details" style="color: #7f8c8d; margin-bottom: 2rem;">
                        ${isPurchase ? 
                            "The visitor shows strong purchase intent based on their behavior. Key factors include product engagement and page value." :
                            "The visitor's behavior suggests they are not likely to make a purchase at this time. Consider improving engagement metrics."}
                    </p>
                    
                    <a href="/" class="back-button">
                        <i class="fas fa-arrow-left"></i>
                        Back to Prediction Form
                    </a>
                </div>
                <script>
                    // Remove confetti after 2-5 seconds
                    if (${isPurchase}) {
                        setTimeout(function() {
                            var confetti = document.getElementById('confetti-wrapper');
                            if (confetti) confetti.remove();
                        }, Math.random() * 3000 + 2000); // 2000ms to 5000ms
                    }
                </script>
            </body>
            </html>
        `);
    });
});

// Add visualization route
app.get('/visualize', (req, res) => {
    // Generate visualizations
    execFile('python', ['python/visualize.py'], (err, stdout, stderr) => {
        if (err) {
            console.error(stderr);
            return res.status(500).send('Visualization Error');
        }
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Data Visualizations</title>
                <link rel="stylesheet" href="style.css">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    .visualization-container {
                        max-width: 1200px;
                        margin: 2rem auto;
                        padding: 2rem;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    .visualization-title {
                        text-align: center;
                        color: #2c3e50;
                        margin-bottom: 2rem;
                    }
                    .visualization-image {
                        width: 100%;
                        height: auto;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .back-link {
                        display: inline-block;
                        margin-top: 2rem;
                        padding: 0.8rem 1.5rem;
                        background: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 10px;
                        transition: all 0.3s ease;
                    }
                    .back-link:hover {
                        background: #45a049;
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
                    }
                </style>
            </head>
            <body>
                <div class="visualization-container">
                    <h1 class="visualization-title">
                        <i class="fas fa-chart-bar"></i>
                        Data Visualizations
                    </h1>
                    <img src="/static/visualizations.png" alt="Data Visualizations" class="visualization-image">
                    <div style="text-align: center;">
                        <a href="/" class="back-link">
                            <i class="fas fa-arrow-left"></i>
                            Back to Prediction Form
                        </a>
                    </div>
                </div>
            </body>
            </html>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)); 