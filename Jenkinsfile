pipeline {
    agent any

    tools {
        nodejs 'node18' // usa la versión 18 que tienes instalada
    }

    environment {
        BACKEND_DIR = 'Back-End'
        FRONTEND_DIR = 'Front-End'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                echo 'Obteniendo código desde Git...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Compilando Backend...'
                dir("${BACKEND_DIR}") {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean compile'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Compilando Frontend Angular...'
                dir("${FRONTEND_DIR}") {

                    // Limpia dependencias corruptas / problemas de permisos
                    sh 'rm -rf node_modules package-lock.json || true || chmod -R u+w node_modules && rm -rf node_modules package-lock.json'

                    // Instala dependencias ignorando conflictos de peerDependencies
                    sh 'npm install --legacy-peer-deps'

                    // Build Angular en modo producción
                    sh 'npm run build -- --configuration production'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Análisis SonarQube (pendiente configuración)'
                // Aquí puedes agregar tu comando sonar-scanner si ya lo configuras
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado correctamente ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}
