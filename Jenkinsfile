pipeline {
    agent any

    environment {
        // Fix para Node/OpenSSL
        NODE_OPTIONS = '--openssl-legacy-provider'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                echo 'Obteniendo código desde Git...'
                checkout([
                    $class: 'GitSCM', 
                    branches: [[name: '*/main']], 
                    userRemoteConfigs: [[url: 'https://github.com/Alvarobaz/Fouriers-Continuum-Experience']]
                ])
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
                    sh 'npm install'
                    // Aquí usamos la variable NODE_OPTIONS que definimos arriba
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Analizando calidad con SonarQube...'
                withSonarQubeEnv('SonarQube') {
                    sh '/var/jenkins_home/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarScanner/bin/sonar-scanner'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}
