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
        // ✅ PUBLICACIÓN EN NEXUS
        // ===============================
        stage('Publish to Nexus') {
            when {
                branch 'main'   // 🔹 solo se ejecuta en main
            }
            steps {
                script {
                    def version = "1.0.${env.BUILD_NUMBER}"

                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        echo "📦 Publicando BACKEND a Nexus con Maven..."
                        dir('Back-End') {
                            sh """
                                mvn deploy:deploy-file \
                                    -DrepositoryId=nexus \
                                    -Durl=http://nexus:8081/repository/maven-releases/ \
                                    -Dfile=target/*.jar \
                                    -DgroupId=com.mycompany.issuetracking \
                                    -DartifactId=issuetracking \
                                    -Dversion=${version} \
                                    -Dpackaging=jar \
                                    -DgeneratePom=true \
                                    -DrepositoryLayout=default \
                                    -Dusername=${NEXUS_USER} \
                                    -Dpassword=${NEXUS_PASS}
                            """
                        }

                        echo "📦 Publicando FRONTEND a Nexus..."
                        dir('Front-End') {
                            // Creamos ZIP del frontend
                            sh "zip -r frontend-${version}.zip dist"
                            sh """
                                curl -v -u ${NEXUS_USER}:${NEXUS_PASS} \
                                --upload-file frontend-${version}.zip \
                                http://nexus:8081/repository/maven-releases/frontend-${version}.zip
                            """
                        }
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
