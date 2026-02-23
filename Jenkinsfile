pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    tools {
        maven 'Default Maven'
        jdk 'Default JDK'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                echo "Haciendo checkout del repositorio..."
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
                    // npm ci limpia e instala; si hay conflictos de peer deps usa --legacy-peer-deps
                    sh 'npm ci --legacy-peer-deps'  

                    echo "Construyendo la aplicación con Angular 8..."
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            tools {
                nodejs 'node18'  // Node 18 para SonarQube
            }
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
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
