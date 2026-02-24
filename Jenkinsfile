pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node22'
        
    }

    
    stages {
        stage('Declarative: Tool Install') {
            steps {
                echo "Usando herramientas configuradas: Maven 3.8.8 y Node10"
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Legacy (Node 10)') {
            
            steps {
                script {
                    echo "Usando Node 10 para build legacy"
                    dir('Front-End') {
                        sh 'node -v'
                        sh 'npm ci --legacy-peer-deps'
                    }
                }
            }
        }

        stage('Build Modern (Node 18)') {
            steps {
                script {
                    echo "Usando Node 18 para build moderno"
                    dir('Front-End') {
                        sh 'node -v'          // Solo install
                        sh 'npm run build'         // Build moderno
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completada correctamente"
        }
        failure {
            echo "❌ Algo falló en la pipeline"
        }
    }
}
