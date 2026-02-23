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

        stage('Install Dependencies') {
            steps {
                dir('Front-End') {
                    echo "Instalando dependencias..."
                    sh 'npm ci'  // limpia e instala dependencias de forma segura
                }
            }
        }

        stage('Build') {
            steps {
                dir('Front-End') {
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
                dir('Front-End') {
                    echo "Ejecutando análisis de SonarQube..."
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
