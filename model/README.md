# Why Logisitic Regression?

I usually build classification models using XGBoost, but recently, I've been wanting to make a habit of building my models from scratch using numpy.
Multi-Class logistic regression was the next step from the regular logistic regression model I learnt how to build.
I learnt a lot about which function to apply to the logits and why those functions are used. I originally applied the sigmoid function to the logits, but later learnt that softmax was the function you should use.
Additionally, when I tried to implement the predict function, my logic was to iterate through the predictions and return the index of the largest value. 
This returned a 222 integer which I'm assuming is because I didn't one-hot encode my data with the original logic being flawed. I used the np.argmax() function which helped a lot in terms of code I had to write out. 

# Information Scores of Individual Features

When implementing the mutual_info_classif() function on the data in relation to the y target, the scores ranged from 0-0.7. 
I played around with dropping certain features to assess the model's performance, but every feature lead to the 78% accuracy except the timestamp feature. 

# Limitations of the Model

The model is overconfident on predicting the second class. Most predictions you will see in the demo are "pred: 1". I'm not sure whether this is the fault of the model or the data that was passed through with there being a possible class imbalance.
