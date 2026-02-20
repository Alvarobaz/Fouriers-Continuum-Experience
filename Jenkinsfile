pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS 20', type: 'NodeJS' // Ajusta si tu Jenkins tiene NodeJS configurado
        PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
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
                dir('Back-End') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean compile'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Compilando Frontend Angular...'
                dir('Front-End') {
                    sh 'npm ci'  // Instala exactamente las dependencias
                    // Deshabilitamos source maps para evitar el error de mappings.wasm
                    sh 'ng build --source-map=false'
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { return false } // Deshabilitado mientras el build falla menos
            }
            steps {
                echo 'Analizando con SonarQube...'
                // Agrega tu comando SonarQube aquí si lo necesitas
            }
        }
    }

    post {
        success {
            echo 'Pipeline finalizado ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}
