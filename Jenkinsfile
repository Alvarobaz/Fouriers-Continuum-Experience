pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    tools {
        maven 'Maven 3.8.8'  // tu instalación de Maven
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies & Build') {
            tools { 
                nodejs 'node10'  // Node 10 para Angular 8
            }
            steps {
                dir('Front-End') {
                    echo "Instalando dependencias con Node 10..."
                    sh 'npm ci --legacy-peer-deps'
                    echo "Construyendo la aplicación con Node 10..."
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            tools {
                nodejs 'node18'  // Node 18 para SonarQube
            }
            steps {
                dir('Front-End') {
                    echo "Ejecutando análisis de SonarQube con Node 18..."
                    sh 'sonar-scanner'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline finalizado correctamente ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}
