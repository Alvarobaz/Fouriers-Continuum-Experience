pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
    }

    stages {
        stage('Checkout SCM') {
            steps { checkout scm }
        }

        stage('Install Dependencies & Build') {
            tools { nodejs 'node10' }
            steps {
                dir('Front-End') {
                    echo "Limpiando node_modules y package-lock.json..."
                    sh 'rm -rf node_modules package-lock.json || true'
                    echo "Instalando dependencias con Node 10..."
                    sh 'npm ci --legacy-peer-deps'
                    echo "Construyendo la aplicación..."
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            tools { nodejs 'node18' }
            steps {
                dir('Front-End') {
                    echo "Ejecutando SonarQube..."
                    sh 'sonar-scanner'
                }
            }
        }
    }

    post {
        success { echo 'Pipeline finalizado correctamente ✅' }
        failure { echo 'Pipeline falló ❌' }
    }
}
