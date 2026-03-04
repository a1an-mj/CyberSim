import pandas as pd
import numpy as np
import kagglehub
import os

# Download latest version
path = kagglehub.dataset_download("chethuhn/network-intrusion-dataset")
all_files = [f for f in os.listdir(path) if f.endswith(".csv")]

dfs = []
for file in all_files:
    df = pd.read_csv(os.path.join(path, file))
    dfs.append(df)

data = pd.concat(dfs, ignore_index=True)

def preprocess_data(data):    
    #merging data
    # data = pd.concat(datas, axis = 0, ignore_index = True)
    print(f"Before duplicate removal{data.shape}")

    #remove leading or trailing whitespace from col names
    col_names = {col: col.strip() for col in data.columns}
    data.rename(columns = col_names, inplace = True)
    
    #duplicate rows removal
    data = data.drop_duplicates(keep = 'first')
    
    #duplicate columns removal
    # columns = data.columns
    # identical_columns =[]
    # list_control = columns.copy().tolist()
    # for col1 in columns:
    #     for col2 in columns:
    #         if(col1!=col2):
    #             if(data[col1].equals(data[col2])):
    #                 if(col2 not in identical_columns and col2 in list_control):
    #                     identical_columns.append(col2)
    #                     if col1 in list_control:
    #                         list_control.remove(col1)
    #                     if col2 in list_control: 
    #                         list_control.remove(col2)
    #                 elif(col2 in identical_columns and col2 in list_control):
    #                     if col2 in list_control: 
    #                         list_control.remove(col2)    
    # for col in identical_columns:
    #     data.drop(columns = col, inplace = True)
                    
    print(f"After duplicate removal{data.shape}")
    
    # Treating infinite values
    data.replace([np.inf, -np.inf], np.nan, inplace=True)
    
    #removing rows with missing values
    missing_rows = data.isna().any(axis=1).sum()
    print(f'\nTotal rows with missing values: {missing_rows}')
    data = data.dropna()
    nan_count = data.isnull().sum().sum()
    print(f"Total NaN values: {nan_count}")
    

    
    print(f"After missing value rows' removal{data.shape}")
    
    #splitting data
    target = data['Label']
    features = data.drop('Label',axis = 1)

    
    return features,target


features, target = preprocess_data(data)

# print("Initial shape:", data.shape)


# data = data.sample(frac=1, random_state=42)
# print("After sampling:", data.shape)


# data.columns = data.columns.str.strip()

# data.replace([np.inf, -np.inf], np.nan, inplace=True)
# data.dropna(inplace=True)

# print("After cleaning:", data.shape)




#ivde splitting to 0 and 1 
# data["Label"] = data["Label"].apply(
#     lambda x: 0 if x == "BENIGN" else 1
# )

# print(data["Label"].value_counts())


# X = data.drop("Label", axis=1)
# y = data["Label"]

# X = X.select_dtypes(include=[np.number])

# print("Feature shape:", X.shape)
from sklearn.preprocessing import StandardScaler,LabelEncoder

def encode_data(data):
    encoder = LabelEncoder()
    for col in data.columns:
        if(data[col].dtype == 'object'):
            data[col] = encoder.fit_transform(data[col])
    nan_count = data.isnull().sum().sum()
    print(f"Total NaN values: {nan_count}")
    return data


features_encoded = encode_data(features)

scaler = StandardScaler()
features_scaled = scaler.fit_transform(features_encoded)




# from imblearn.under_sampling import RandomUnderSampler

# rus = RandomUnderSampler(
#     sampling_strategy='not minority',  #
#     random_state=42
# )

# features_sampled, target_sampled = rus.fit_resample(
#     features_scaled,
#     target
# )



import numpy as np



def balance_to_fixed_size(X, y, samples_per_class):
    y = np.array(y)

    unique_classes, counts = np.unique(y, return_counts=True)

    print("Class distribution before balancing:")
    for cls, cnt in zip(unique_classes, counts):
        print(f"{cls}: {cnt}")

    X_list = []
    y_list = []

    np.random.seed(42)

    for cls in unique_classes:
        idx = np.where(y == cls)[0]

        if len(idx) >= samples_per_class:
            # Undersample
            selected = np.random.choice(
                idx,
                size=samples_per_class,
                replace=False
            )
        else:
            # Oversample
            selected = np.random.choice(
                idx,
                size=samples_per_class,
                replace=True
            )

        X_list.append(X[selected])
        y_list.append(y[selected])

    X_new = np.vstack(X_list)
    y_new = np.concatenate(y_list)

    print(f"\nAll classes balanced to {samples_per_class} samples each.")

    return X_new, y_new


features_sampled, target_sampled = balance_to_fixed_size(
    features_scaled,
    target,
    samples_per_class=10000
)

print("After undersampling:")
print(pd.Series(target_sampled).value_counts())


from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
import numpy as np

kmeans = KMeans(n_clusters=3, random_state=42)
k_labels = kmeans.fit_predict(features_sampled)

gmm = GaussianMixture(n_components=3, random_state=42)
g_labels = gmm.fit_predict(features_sampled)

features_sfe = np.column_stack((features_sampled, k_labels, g_labels))


from sklearn.decomposition import PCA

pca = PCA(n_components=10)
features_pca = pca.fit_transform(features_sfe)

print("After PCA:", features_pca.shape)


from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(
    features_pca, target_sampled, test_size=0.2, random_state=42
)



model = RandomForestClassifier(    n_estimators=200,
    class_weight="balanced",
    n_jobs=-1,verbose=1)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))

import joblib


joblib.dump(scaler, "scaler.pkl")      
joblib.dump(kmeans, "kmeans.pkl")     
joblib.dump(gmm, "gmm.pkl")            
joblib.dump(pca, "pca.pkl")            


joblib.dump(X_train, "X_train.pkl")
joblib.dump(y_train, "y_train.pkl")
joblib.dump(X_test, "X_test.pkl")
joblib.dump(y_test, "y_test.pkl")


joblib.dump(model, "cic_model.pkl")

print("\n✅ All models saved successfully!")





# print("Before undersampling:", X_scaled.shape)
# print("After undersampling:", X_res.shape)