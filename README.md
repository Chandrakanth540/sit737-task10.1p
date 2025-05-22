```markdown
# Node.js Kubernetes Deployment on Google Cloud Platform (GCP)

This project demonstrates how to containerize a simple Node.js application, push the image to Google Container Registry (GCR), and deploy it on a Google Kubernetes Engine (GKE) cluster. It also includes secure authentication using a Kubernetes `docker-registry` secret.

---

## 📁 Project Structure

```

.
├── deployment.yaml       # Kubernetes deployment manifest
├── service.yaml          # Kubernetes service manifest
├── index.js              # Node.js application entry point
├── Dockerfile            # Docker configuration (assumed created)
└── README.md             # This file

````

---

## 🚀 Setup Instructions

### 1. Build and Push Docker Image to GCR

Ensure you are authenticated with GCR and your GCP project is active:

```bash
gcloud auth configure-docker
docker build -t gcr.io/PROJECT-ID/task10:v1 .
docker push gcr.io/PROJECT-ID/task10:v1
````

Replace `PROJECT-ID` with your actual GCP project ID (e.g., `root-vortex-460311-g1`).

---

### 2. Create a Service Account & Key for GCR Access

* Go to [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
* Create a new service account or use an existing one
* Assign it the following roles:

  * `Storage Object Viewer`
* Generate a JSON key and download it as `keyfile.json`

---

### 3. Create Kubernetes Secret for Image Pull

```bash
kubectl create secret docker-registry gcr-json-key \
  --docker-server=https://gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat keyfile.json)" \
  --docker-email=your-email@gmail.com
```

> Make sure to use `_json_key` exactly as shown above.

---

### 4. Deploy to GKE

Apply your deployment and service manifests:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

---

### 5. Verify Deployment

Check if the pods are running:

```bash
kubectl get pods
kubectl describe pod <pod-name>
```

Check the service and external IP:

```bash
kubectl get svc
```

Visit the external IP in your browser to access the Node.js app.

---

## 📦 Files Overview

### `index.js`

Basic Node.js server that listens on port 8080.

### `deployment.yaml`

Deploys the containerized app with:

* 2 replicas
* Secure image pull using `imagePullSecrets`

### `service.yaml`

Exposes the app using a **LoadBalancer** service on port 80.

---

## ✅ Troubleshooting

* **ImagePullBackOff**: Make sure your service account has access and the secret is correctly referenced in the deployment.
* **403 errors**: Usually related to incorrect IAM permissions on the service account.
* Use `kubectl logs <pod-name>` and `kubectl describe pod <pod-name>` to inspect issues.

---

## 🧼 Clean Up

```bash
kubectl delete -f service.yaml
kubectl delete -f deployment.yaml
kubectl delete secret gcr-json-key
```

---

## 👤 Author

Chandrakanth 
