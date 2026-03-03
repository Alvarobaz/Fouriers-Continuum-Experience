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

        // ===============================
        // BUILD FRONTEND
        // ===============================
        stage('Build Frontend (Node 16)') {
            steps {
                dir('Front-End') {
                    sh 'node -v'
                    sh 'npm ci --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }

        // ===============================
        // BUILD BACKEND
        // ===============================
        stage('Build Backend (Maven)') {
            steps {
                dir('Back-End') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        // ===============================
        // SONARQUBE
        // ===============================
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

        // ===============================
        // CREATE FRONTEND ZIP
        // ===============================
        stage('Package Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        echo "📦 Creando ZIP del frontend..."

                        # crea zip SIN usar root ni apt
                        npx bestzip frontend.zip dist

                        echo "Contenido Front-End:"
                        ls -l
                    '''
                }
            }
        }

        // ===============================
        // PUBLISH NEXUS
        // ===============================
        stage('Publish to Nexus') {
            when {
                branch 'main'
            }
            steps {
                script {

                    def version = "1.0.${env.BUILD_NUMBER}"

                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        echo "📦 Publicando artefactos versión ${version}"

                        sh """
                        set -e

                        echo "Subiendo BACKEND..."
                        curl -f -v -u $NEXUS_USER:$NEXUS_PASS \
                        --upload-file Back-End/target/*.jar \
                        http://nexus:8081/repository/maven-releases/backend-${version}.jar

                        echo "Subiendo FRONTEND..."
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
