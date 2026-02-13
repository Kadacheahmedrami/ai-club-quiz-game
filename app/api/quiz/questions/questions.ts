
export const ServerQuestions: any[] = (() => {
  // Original questions data
  const originalQuestions = [
    { id: 1, question: "What does AI stand for?", options: ["Automated Interface", "Artificial Intelligence", "Algorithmic Integration", "Adaptive Internet"], correctAnswer: 1 },
    { id: 2, question: "Which language is currently most popular for ML prototyping?", options: ["Java", "Python", "Ruby", "PHP"], correctAnswer: 1 },
    { id: 3, question: "What is supervised learning?", options: ["Learning without labels", "Learning from labeled examples", "Learning from rewards", "Learning by clustering"], correctAnswer: 1 },
    { id: 4, question: "Which algorithm is commonly used for clustering?", options: ["Logistic Regression", "K-Means", "Decision Tree", "SVM"], correctAnswer: 1 },
    { id: 5, question: "What does NLP stand for?", options: ["Neural Labeling Process", "Natural Language Processing", "Network Learning Protocol", "New Language Program"], correctAnswer: 1 },
    { id: 6, question: "Which model architecture is commonly used for images?", options: ["RNN", "Transformer", "CNN", "Markov Model"], correctAnswer: 2 },
    { id: 7, question: "What is overfitting?", options: ["Model performs well on test but not train", "Model performs poorly overall", "Model memorizes training data and fails to generalize", "Model uses too little data"], correctAnswer: 2 },
    { id: 8, question: "Which loss is commonly used for classification problems?", options: ["Mean Squared Error", "Cross-Entropy Loss", "L1 Loss", "Hinge Loss only"], correctAnswer: 1 },
    { id: 9, question: "What is a feature in ML?", options: ["Output label", "Hyperparameter", "Input variable used by the model", "Loss value"], correctAnswer: 2 },
    { id: 10, question: "Which optimizer adapts learning rates per parameter?", options: ["SGD", "Adam", "Momentum only", "Gradient Descent with constant LR"], correctAnswer: 1 },

    { id: 11, question: "What does CNN stand for?", options: ["Cascaded Neural Network", "Convolutional Neural Network", "Central Neural Node", "Continuous Neural Network"], correctAnswer: 1 },
    { id: 12, question: "Which technique reduces model complexity by randomly disabling neurons?", options: ["BatchNorm", "Dropout", "Pooling", "Data Augmentation"], correctAnswer: 1 },
    { id: 13, question: "What is transfer learning?", options: ["Training two models together", "Reusing a model trained on one task for another", "Training from scratch always", "Combining datasets"], correctAnswer: 1 },
    { id: 14, question: "Which metric balances precision and recall?", options: ["Accuracy", "ROC AUC", "F1 Score", "MSE"], correctAnswer: 2 },
    { id: 15, question: "What does GPU do for training?", options: ["Increase disk space", "Enable parallel computation for tensors", "Replace CPU entirely", "Serve web pages"], correctAnswer: 1 },
    { id: 16, question: "Which is an example of unsupervised learning?", options: ["Linear Regression", "Logistic Regression", "K-Means Clustering", "Supervised SVM"], correctAnswer: 2 },
    { id: 17, question: "What is a confusion matrix used for?", options: ["Visualizing model weights", "Summarizing classification results (TP/FP/TN/FN)", "Storing datasets", "Hyperparameter tuning"], correctAnswer: 1 },
    { id: 18, question: "What is data augmentation?", options: ["Collecting more labels", "Generating new training examples by transforming existing ones", "Reducing dataset size", "Changing model architecture"], correctAnswer: 1 },
    { id: 19, question: "Which activation introduces sparsity and helps vanishing gradients less than sigmoid?", options: ["Sigmoid", "Tanh", "ReLU", "Softmax"], correctAnswer: 2 },
    { id: 20, question: "What is the purpose of batch normalization?", options: ["Reduce dataset size", "Normalize layer inputs to stabilize training", "Encrypt model weights", "Add noise to inputs"], correctAnswer: 1 },

    { id: 21, question: "Which algorithm is used for decision boundaries with margins?", options: ["K-Means", "SVM (Support Vector Machine)", "KNN", "PCA"], correctAnswer: 1 },
    { id: 22, question: "What does 'epoch' mean in training?", options: ["One update of a single parameter", "One full pass through the training dataset", "Number of layers", "Number of features"], correctAnswer: 1 },
    { id: 23, question: "What is early stopping?", options: ["Stopping training after one batch", "Stopping when validation performance stops improving to avoid overfitting", "Stopping data collection", "Stopping model saving"], correctAnswer: 1 },
    { id: 24, question: "Which method combines many weak learners into a strong one?", options: ["PCA", "Ensemble methods (e.g., boosting)", "KNN", "Normalization"], correctAnswer: 1 },
    { id: 25, question: "Which of these is a popular boosting algorithm?", options: ["Random Forest", "KNN", "XGBoost", "PCA"], correctAnswer: 2 },
    { id: 26, question: "What is word embedding?", options: ["A way to compress images", "Mapping words to dense numerical vectors", "A type of optimizer", "Data normalization"], correctAnswer: 1 },
    { id: 27, question: "Which model introduced the attention mechanism to NLP widely?", options: ["RNN", "Transformer", "CNN", "SVM"], correctAnswer: 1 },
    { id: 28, question: "What is 'tokenization' in NLP?", options: ["Encrypting text", "Splitting text into smaller units like words or subwords", "Normalizing numbers", "Compressing text"], correctAnswer: 1 },
    { id: 29, question: "What does 'precision' measure?", options: ["Proportion of true positives among predicted positives", "Proportion of true positives among actual positives", "Accuracy only", "Loss value"], correctAnswer: 0 },
    { id: 30, question: "Which technique reduces the number of features while keeping variance?", options: ["Overfitting", "PCA (Principal Component Analysis)", "Dropout", "Cross-Validation"], correctAnswer: 1 },

    { id: 31, question: "What is 'fine-tuning' a pre-trained model?", options: ["Retraining entire model from scratch", "Adjusting a pre-trained model on a new dataset", "Freezing the model forever", "Converting model to ONNX only"], correctAnswer: 1 },
    { id: 32, question: "Which search strategy explores many hyperparameter combinations randomly?", options: ["Grid Search", "Random Search", "Bayesian Optimization always", "Manual tuning"], correctAnswer: 1 },
    { id: 33, question: "What is 'zero-shot' learning?", options: ["Model trained on zero data", "Model generalizes to tasks it wasn't explicitly trained on", "Model with zero parameters", "Model that returns zeros"], correctAnswer: 1 },
    { id: 34, question: "Which concept describes distribution change after deployment?", options: ["Overfitting", "Concept Drift", "Underfitting", "Vanishing Gradient"], correctAnswer: 1 },
    { id: 35, question: "What is L1 regularization known for?", options: ["Encouraging dense weights", "Encouraging sparse weights (feature selection)", "Faster training always", "Increasing model capacity"], correctAnswer: 1 },
    { id: 36, question: "Which generative model uses a generator and a discriminator?", options: ["Autoencoder", "GAN (Generative Adversarial Network)", "SVM", "K-Means"], correctAnswer: 1 },
    { id: 37, question: "What is a diffusion model used for?", options: ["Supervised classification only", "Probabilistic generative modeling (image/audio generation)", "Clustering", "Feature selection"], correctAnswer: 1 },
    { id: 38, question: "What does 'self-supervised learning' do?", options: ["Requires human labels for everything", "Creates supervisory signals from the data itself", "Needs external rewards", "Uses unlabeled data only for evaluation"], correctAnswer: 1 },
    { id: 39, question: "Which algorithm is used for sequence data and has gating mechanisms?", options: ["CNN", "LSTM/GRU", "PCA", "K-Means"], correctAnswer: 1 },
    { id: 40, question: "What is beam search used for?", options: ["Optimizing GPUs", "Decoding sequences in generation tasks keeping top-k candidates", "Data augmentation", "Normalizing inputs"], correctAnswer: 1 },

    { id: 41, question: "What is 'temperature' in text generation?", options: ["A hardware metric", "A parameter controlling randomness of predictions", "Number of tokens", "Size of embedding"], correctAnswer: 1 },
    { id: 42, question: "What is top-p (nucleus) sampling?", options: ["Always choose top 1 token", "Sample from smallest set of tokens whose cumulative probability ≥ p", "Deterministic decoding", "A regularization method"], correctAnswer: 1 },
    { id: 43, question: "Which embedding method uses context to produce token vectors?", options: ["Word2Vec static vectors", "Contextual models like BERT/GPT", "Bag-of-words only", "One-hot encoding"], correctAnswer: 1 },
    { id: 44, question: "What is 'positional encoding' used for in transformers?", options: ["Encode token positions since transformer has no recurrence", "Encode output labels", "Normalize inputs", "Compress weights"], correctAnswer: 0 },
    { id: 45, question: "Which metric is useful for imbalanced classification?", options: ["Accuracy", "F1 Score or ROC AUC", "Number of epochs", "Batch size"], correctAnswer: 1 },
    { id: 46, question: "What does 'precision-recall tradeoff' refer to?", options: ["Between two models only", "Increasing precision decreases recall and vice versa", "Between loss and accuracy", "Between GPUs and CPUs"], correctAnswer: 1 },
    { id: 47, question: "What is 'pruning' a model?", options: ["Adding more layers", "Removing weights/neurons to reduce size and improve latency", "Changing dataset", "Encrypting model"], correctAnswer: 1 },
    { id: 48, question: "Which file format is commonly used for model interoperability?", options: [".txt", ".onnx", ".jpg", ".csv"], correctAnswer: 1 },
    { id: 49, question: "What is 'quantization' in model deployment?", options: ["Increasing precision", "Reducing numeric precision to shrink model and speed inference", "Adding more parameters", "Encrypting data"], correctAnswer: 1 },
    { id: 50, question: "Which term describes exploration vs exploitation in RL?", options: ["Precision-Recall", "Exploration-exploitation dilemma (e.g., epsilon-greedy)", "Bias-Variance", "Dropout-BatchNorm"], correctAnswer: 1 },

    { id: 51, question: "What is Q-learning?", options: ["A supervised algorithm", "A value-based reinforcement learning algorithm estimating Q-values", "A clustering technique", "A type of optimizer"], correctAnswer: 1 },
    { id: 52, question: "What is a policy in reinforcement learning?", options: ["Loss function", "A mapping from states to actions", "A dataset", "A metric"], correctAnswer: 1 },
    { id: 53, question: "Which method approximates policy directly using gradients?", options: ["Q-learning", "Policy Gradient methods", "K-Means", "PCA"], correctAnswer: 1 },
    { id: 54, question: "What is 'actor-critic' in RL?", options: ["Two-player game", "A hybrid RL architecture with actor (policy) and critic (value)", "A data cleaning method", "A visualization tool"], correctAnswer: 1 },
    { id: 55, question: "Which technique helps interpret ML model predictions locally?", options: ["PCA", "LIME/SHAP", "Dropout", "Data augmentation"], correctAnswer: 1 },
    { id: 56, question: "What is 'explainability' in AI?", options: ["The ability to explain runtime errors", "Understanding and communicating model decisions", "Faster training", "Higher accuracy only"], correctAnswer: 1 },
    { id: 57, question: "Which framework is commonly used for deep learning in Python?", options: ["Ruby on Rails", "TensorFlow / PyTorch", "Laravel", "Spring"], correctAnswer: 1 },
    { id: 58, question: "What is ensemble averaging used for?", options: ["Decrease dataset size", "Combine predictions from multiple models to reduce variance", "Increase learning rate", "Normalize inputs"], correctAnswer: 1 },
    { id: 59, question: "Which technique is for dimensionality reduction preserving locality?", options: ["PCA", "t-SNE / UMAP", "Dropout", "BatchNorm"], correctAnswer: 1 },
    { id: 60, question: "What is 'backpropagation'?", options: ["Forward pass only", "Algorithm to compute gradients and update weights", "A data collection method", "A hyperparameter search"], correctAnswer: 1 },

    { id: 61, question: "Which problem is 'vanishing gradient' associated with?", options: ["Too large batch size", "Deep networks with activations like sigmoid/tanh causing tiny gradients", "Data augmentation", "GPU overheating"], correctAnswer: 1 },
    { id: 62, question: "What is 'transfer of learning' advantage?", options: ["Always worse performance", "Faster convergence and better performance with less data", "Requires more data", "Increases model size only"], correctAnswer: 1 },
    { id: 63, question: "Which algorithm is non-parametric and uses majority vote among neighbors?", options: ["SVM", "K-Nearest Neighbors (KNN)", "Linear Regression", "Decision Tree"], correctAnswer: 1 },
    { id: 64, question: "What is 'cross validation' used for?", options: ["Increase model size", "Estimate model performance reliably by splitting data into folds", "Encrypt datasets", "Normalize labels"], correctAnswer: 1 },
    { id: 65, question: "Which component of a transformer computes relationships between tokens?", options: ["Convolutional layer", "Attention mechanism", "Pooling layer", "Softmax only"], correctAnswer: 1 },
    { id: 66, question: "What is 'softmax' used for?", options: ["Regression output", "Converting logits to probability distribution over classes", "Data normalization", "Loss calculation only"], correctAnswer: 1 },
    { id: 67, question: "Which evaluation curve plots true positive rate vs false positive rate?", options: ["Precision-Recall curve", "ROC curve", "Loss curve", "Learning curve"], correctAnswer: 1 },
    { id: 68, question: "What is 'embedding dimension' referring to?", options: ["Number of classes", "Size of the vector representing tokens/objects", "Batch size", "Number of epochs"], correctAnswer: 1 },
    { id: 69, question: "Which is a subword tokenization method used by many LLMs?", options: ["Whitespace only", "Byte-Pair Encoding (BPE)", "Stemming", "Lemmatization"], correctAnswer: 1 },
    { id: 70, question: "What is 'few-shot' learning?", options: ["Training with millions of examples", "Adapting a model with only a few labeled examples", "Zero labels always", "Only for images"], correctAnswer: 1 },

    { id: 71, question: "Which method reduces model size by using lower-bit representations?", options: ["BatchNorm", "Quantization", "Dropout", "Ensembling"], correctAnswer: 1 },
    { id: 72, question: "What is 'model drift'?", options: ["Model stops training", "Model performance degrades over time due to data distribution changes", "Model size increases", "More regularization needed"], correctAnswer: 1 },
    { id: 73, question: "Which library is primarily used for scientific computing (arrays) in Python?", options: ["Pandas", "NumPy", "Flask", "Express"], correctAnswer: 1 },
    { id: 74, question: "What is 'epoch vs batch' difference?", options: ["Epoch is one batch, batch is full data", "Epoch = full dataset pass, batch = subset processed at once", "They are identical", "Batch is number of epochs"], correctAnswer: 1 },
    { id: 75, question: "Which algorithm uses decision trees averaged over many bootstrap samples?", options: ["Boosting", "Random Forest", "K-Means", "SVM"], correctAnswer: 1 },
    { id: 76, question: "What is 'gradient clipping' used for?", options: ["Reduce model size", "Limit gradient norm to prevent exploding gradients", "Increase learning rate", "Normalize features"], correctAnswer: 1 },
    { id: 77, question: "Which concept helps protect user data by adding noise to gradients?", options: ["L1 regularization", "Differential Privacy", "Dropout", "BatchNorm"], correctAnswer: 1 },
    { id: 78, question: "What is 'federated learning'?", options: ["Centralized training only", "Training models across many client devices without centralizing raw data", "Data augmentation technique", "Distributed GPU training with same data"], correctAnswer: 1 },
    { id: 79, question: "Which algorithm is used for object detection in images (one popular family)?", options: ["YOLO (You Only Look Once)", "KNN", "PCA", "Naive Bayes"], correctAnswer: 0 },
    { id: 80, question: "What does 'A/B testing' measure in ML-backed products?", options: ["Model architecture", "Which variant yields better user/metric results", "Number of parameters", "Dataset size"], correctAnswer: 1 },

    { id: 81, question: "Which method finds feature importance by permuting feature values?", options: ["Dropout", "SHAP only", "Permutation importance", "BatchNorm"], correctAnswer: 2 },
    { id: 82, question: "What is 'kernel trick' associated with?", options: ["Neural Networks", "SVMs to operate in high-dimensional space implicitly", "K-Means", "Decision Trees"], correctAnswer: 1 },
    { id: 83, question: "Which technique prevents overfitting by adding penalty on large weights?", options: ["Data Augmentation", "Regularization (L1/L2)", "Dropout only", "BatchNorm only"], correctAnswer: 1 },
    { id: 84, question: "What is 'catastrophic forgetting' in continual learning?", options: ["Model forgets old tasks when trained on new ones", "Model forgets training data physically", "Model forgets labels", "Model forgets epoch count"], correctAnswer: 0 },
    { id: 85, question: "Which is an explainability tool that attributes feature contributions?", options: ["LIME", "t-SNE", "Dropout", "K-Means"], correctAnswer: 0 },
    { id: 86, question: "What is 'beam width' in beam search?", options: ["Number of beams kept at each decoding step", "Number of layers", "Batch size", "Embedding size"], correctAnswer: 0 },
    { id: 87, question: "Which approach is used for language model fine-tuning with very few new parameters (efficient tuning)?", options: ["Full fine-tuning always", "Adapters / LoRA", "Increase batch size only", "Remove attention"], correctAnswer: 1 },
    { id: 88, question: "What does 'MLE' stand for in probabilistic modeling?", options: ["Maximum Likelihood Estimation", "Minimum Loss Estimation", "Model Layer Encoding", "Multi-Loss Ensemble"], correctAnswer: 0 },
    { id: 89, question: "Which sampling method restricts to top-k tokens before sampling?", options: ["Top-p", "Top-k", "Greedy only", "Temperature only"], correctAnswer: 1 },
    { id: 90, question: "What is 'semantic segmentation' in CV?", options: ["Classify entire image", "Label each pixel with a class", "Detect objects with bounding boxes only", "Compress images"], correctAnswer: 1 },

    { id: 91, question: "Which technique speeds up inference by running models on specialized hardware?", options: ["Using more CPUs only", "Using accelerators like TPU / GPU / NPU", "Using more RAM only", "Using web servers"], correctAnswer: 1 },
    { id: 92, question: "What is 'hyperparameter'?", options: ["A learnable weight", "A configuration parameter set before training (e.g., lr, batch size)", "A data point", "A metric"], correctAnswer: 1 },
    { id: 93, question: "Which method tunes hyperparameters using a model of the objective function?", options: ["Grid Search", "Random Search", "Bayesian Optimization", "Manual try-and-error"], correctAnswer: 2 },
    { id: 94, question: "What is 'class imbalance' and why problematic?", options: ["All classes equal", "Some classes have far fewer examples causing biased models", "Too many classes always", "No labels present"], correctAnswer: 1 },
    { id: 95, question: "Which token representation is simplest and high-dimensional but sparse?", options: ["One-hot encoding", "Word2Vec", "BERT embedding", "PCA of words"], correctAnswer: 0 },
    { id: 96, question: "Which model type is designed for sequence-to-sequence tasks like translation?", options: ["CNN only", "Seq2Seq models with encoder-decoder architectures", "KNN", "PCA"], correctAnswer: 1 },
    { id: 97, question: "What is 'sampling temperature' effect when >1 ?", options: ["Makes distribution sharper (less random)", "Makes distribution flatter (more random)", "Removes tokens", "Always deterministic"], correctAnswer: 1 },
    { id: 98, question: "Which technique uses ensemble of trees trained sequentially to correct previous errors?", options: ["Random Forest", "Gradient Boosting (e.g., XGBoost)", "K-Means", "SVM"], correctAnswer: 1 },
    { id: 99, question: "What is the role of a validation set?", options: ["Train the model", "Tune hyperparameters and estimate generalization during development", "Replace test set forever", "Encrypt data"], correctAnswer: 1 },
    { id: 100, question: "Which privacy-preserving technique trains with gradients aggregated on device and only updates model server-side?", options: ["Centralized training", "Federated Learning", "Batch Normalization", "Data Duplication"], correctAnswer: 1 }
  ];

  // Shuffle the options for each question and update the correctAnswer index accordingly
  return originalQuestions.map(question => {
    // Create an array of indices [0, 1, 2, 3] for the 4 options
    const indices = question.options.map((_, idx) => idx);

    // Fisher-Yates shuffle algorithm
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Create new options array based on shuffled indices
    const newOptions = indices.map(idx => question.options[idx]);

    // Find the new position of the original correct answer
    const newCorrectAnswerIndex = indices.indexOf(question.correctAnswer);

    return {
      ...question,
      options: newOptions,
      correctAnswer: newCorrectAnswerIndex
    };
  });
})();


