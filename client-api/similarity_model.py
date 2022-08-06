from sentence_transformers import SentenceTransformer, util
import sys
sentences = sys.argv[1:]
#sentences = ["plant based milk", "cereal", "plant based meat"]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embeddings = model.encode(sentences, convert_to_tensor=True)

cosine_scores = util.cos_sim(embeddings, embeddings)
#Find the pairs with the highest cosine similarity scores
pairs = []

for i in range(1, len(cosine_scores)): # change this to only compare first sentence (source) with everything else
    pairs.append({'index': [0, i], 'score': cosine_scores[0][i]})

#Sort scores in decreasing order

list_of_score = []
for pair in pairs[0:10]:
    toAdd = {}
    i, j = pair['index']
    #print("{} \t\t {} \t\t Score: {:.4f}".format(sentences[i], sentences[j], pair['score']))
    toAdd = {"sentence_1": sentences[i], "sentence_2": sentences[j], "score": round(float(pair['score']), 4)}
    list_of_score.append(round(float(pair['score']), 4))#toAdd)

print(list_of_score)
