pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Clean Workspace') {
            steps {
                // Limpiamos node_modules y package-lock.json si existen
                sh '''
                [ -d node_modules ] && rm -rf node_modules
                [ -f package-lock.json ] && rm -f package-lock.json
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('.') { // Apunta a la raíz del repo
                    echo "Instalando dependencias..."
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('.') {
                    echo "Construyendo la aplicación..."
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                dir('.') {
                    echo "Ejecutando análisis de SonarQube..."
                    // Ajusta esto según tu configuración de Sonar
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
