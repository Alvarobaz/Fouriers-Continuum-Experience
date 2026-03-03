pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node16'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend (Node 16)') {
            steps {
                dir('Front-End') {
                    sh 'node -v'
                    sh 'npm ci --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                dir('Back-End') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        // ✅ TEST CONEXIÓN NEXUS
        stage('Test Nexus Connection') {
            steps {
                sh 'curl -v http://nexus:8081'
            }
        }

        // ✅ CREAR ZIP FRONTEND (SIN zip ni root)
        stage('Package Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        npx bestzip frontend.zip dist
                        echo "Contenido Front-End:"
                        ls -l
                    '''
                }
            }
        }

        // ✅ PUBLICAR EN NEXUS
        stage('Publish to Nexus') {
            steps {
                script {

                    def version = "1.0.${env.BUILD_NUMBER}"

                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh """
                        set -e

                        echo "===== BACKEND FILES ====="
                        ls Back-End/target/

                        echo "===== FRONTEND FILES ====="
                        ls Front-End/

                        echo "📦 Subiendo backend..."

                        curl -f -v -u $NEXUS_USER:$NEXUS_PASS \
                        --upload-file Back-End/target/*.jar \
                        http://nexus:8081/repository/maven-releases/backend-${version}.jar

                        echo "📦 Subiendo frontend..."

                        curl -f -v -u $NEXUS_USER:$NEXUS_PASS \
                        --upload-file Front-End/frontend.zip \
                        http://nexus:8081/repository/maven-releases/frontend-${version}.zip
                        """
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
