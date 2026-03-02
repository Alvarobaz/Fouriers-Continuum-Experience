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

        // ===============================
        // ✅ NUEVO STAGE — PUBLISH NEXUS
        // ===============================
        stage('Publish to Nexus') {
            when {
                branch 'master'
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

                        // BACKEND JAR
                        sh """
                        curl -u $NEXUS_USER:$NEXUS_PASS \
                        --upload-file Back-End/target/*.jar \
                        http://host.docker.internal:8081/repository/maven-releases/backend-${version}.jar
                        """

                        // FRONTEND ZIP
                        sh """
                        cd Front-End
                        zip -r frontend-${version}.zip dist
                        """

                        sh """
                        curl -u $NEXUS_USER:$NEXUS_PASS \
                        --upload-file Front-End/frontend-${version}.zip \
                        http://host.docker.internal:8081/repository/maven-releases/frontend-${version}.zip
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
