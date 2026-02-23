pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
    }

    stages {
        stage('Checkout SCM') {
            steps { 
                checkout scm 
            }
        }

        stage('Install Dependencies & Build') {
            tools { nodejs 'node10' }
            steps {
                dir('Front-End') {
                    echo "Eliminando completamente el directorio para evitar problemas de permisos..."
                    sh 'rm -rf ./* || true'  // borra todo el contenido del Front-End
                    echo "Instalando dependencias con Node 10..."
                    sh 'npm install --legacy-peer-deps'
                    echo "Construyendo la aplicación..."
                    sh 'npx ng build'
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
