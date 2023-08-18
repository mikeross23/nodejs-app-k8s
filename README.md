# Repository contains of necessary files and instructions to deploy simple "Hello world" node.js application to Kubernetes cluster with monitoring stack to scrape and show this application metrics using Prometheus/Grafana/Loki.

## Requirements:

- Docker
- Kubernetes
- Minikube
- Helm

## Deploying node.js application:

Start a Kubernetes cluster:

```bash
minikube start --driver=docker
```

Create a namespace for app:

```bash
kubectl create namespace my-app
```

Move to \<my-nodejs-app\> directory.

Create deployment:

```bash
kubectl create -f api-depl.yaml -n my-app
```

You can check your services inside the cluster by running the below command:

```bash
kubectl get service -n my-app
```

Run the below command to enable External-IP for your application:

```bash
minikube service api-service -n my-app
```

The above command will automatically open your Node.js application in the browser. If not, you can copy URL to your browser, then you will see your app runs there.
Also, notice that the node port has appended to the URL.

## Deploying Prometheus:

Create namespace:

```bash
kubectl create namespace monitoring
```

Add Prometheus repository and update:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update
```

Install Prometheus chart:

```bash
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
```

Change directory to \<monitoring\>

Update Prometheus to scrape metrics:

```bash
helm upgrade prometheus prometheus-community/kube-prometheus-stack -f values.yaml -n monitoring
```

You can run Prometheus in your browser using command:

```bash
minikube service prometheus-kube-prometheus-prometheus -n monitoring
```

## Deploying Grafana:

Add repository and install Grafana:

```bash
helm repo add grafana https://grafana.github.io/helm-charts

helm install grafana grafana/grafana -n monitoring
```

Get your admin password using command:

```bash
kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

Open Grafana in browser:

```bash
minikube service grafana -n monitoring
```

Add Prometheus Data Source:

- Click on the gear icon (⚙️) on the left sidebar to open the "Configuration" menu, then click on "Data Sources."
- Click the "Add data source" button.
- Choose "Prometheus" as the data source type.
- In the "HTTP" section, enter the URL of your Prometheus instance (e.g., http://prometheus-kube-prometheus-prometheus:9090).
- Click "Save & Test" to validate the connection.

## Deploying Loki:

```bash
helm install loki grafana/loki -n monitoring
```

Configure Loki Data Source in Grafana:

- Similar to adding the Prometheus data source, add Loki as a data source in Grafana.
- Choose "Loki" as the data source type.
- Enter the URL of your Loki instance (e.g., http://loki:3100).
- Click "Save & Test" to validate the connection.
