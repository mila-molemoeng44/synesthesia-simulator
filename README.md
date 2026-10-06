# synesthesia-simulator

Hi! This is a project that attempts to simulate synesthesia. This project started as a from-scrath logistic regression model that then evolved into an API which was then integrated into a frontend react js project. 

# Demo

https://github.com/user-attachments/assets/c3cbd9fe-3ba8-4e3d-93f1-03240025e236


# Why Synesthesia? 

I saw a project on X that connected music to images and I wanted to make something similar myself with: 

1) my love for music
2) the knowledge I've acquired in react js, machine learning and some backend work.

I've always been curious about synesthesia and I thought it would be cool to connect an ml model to return music co-ordinated color gradients. 

# The Process

The pipeline was really simple and took 2 days to get done. 

1) I started with the logisitic regression model built with numpy. I preprocessed the data, ran mutual information scoring at some point and then exported the model weights and biases.

2) I then created the backend API with FastAPI and deployed that on Railway. I created a new instance of LinearRegression() and used my model's weights and biases. I initially exported the model as a .pkl file and wanted to reference the from-scratch model, but Railway threw errors of not really recognising the numpy made model.

3) I built the simple frontend with react js. I used Meyda.js to extract audio features that matched the features of the data. I then plugged in the extracted features into the input for my model to predict on what it was hearing.

4) I mapped each prediction class to a color gradient made with CSS.

# Current Limitations

The model tends to classify most of what it's hearing in the second class returning "pred: 1".
Interestingly, a percussion infection consistent with a snare, triggered a return value of 4 which is the bright energetic class. Additionally, an 808 triggered the deep calm class. 

The model is possibly displaying class bias. Additionally, the low/mid/high energy bands needed to be recalibrated in the frontend to match training data inputs. 

Currently, I am investigating what I can do with the raw Meyda.js features to get the best results from the model. Additionally, I will have to look into how the synthetic data is structured to rule out class imbalances.



