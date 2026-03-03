
pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node16'
    }

    stages {

        stage('Clean Workspace') {
            steps { deleteDir() }
        }

        stage('Checkout SCM') {
            steps { checkout scm }
        }

        stage('Build Frontend') {
            steps {
                dir('Front-End') {
                    sh 'npm ci --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Back-End') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

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

        stage('Publish Backend to Nexus') {
            steps {
                dir('Back-End') {
                    script {
                        withCredentials([usernamePassword(
                            credentialsId: 'nexus-cred',
                            usernameVariable: 'NEXUS_USER',
                            passwordVariable: 'NEXUS_PASS'
                        )]) {

                            def groupId = "com.mycompany.issuetracking"
                            def artifactId = "issuetracking"
                            def version = "0.0.1-${env.BUILD_NUMBER}"
                            def jarFile = "target/issuetracking-0.0.1-SNAPSHOT.jar"

                            sh """
                                echo "Subiendo BACKEND a Nexus con Maven..."
                                mvn deploy:deploy-file \
                                    -DrepositoryId=nexus \
                                    -Durl=http://nexus:8081/repository/maven-releases/ \
                                    -Dfile=${jarFile} \
                                    -DgroupId=${groupId} \
                                    -DartifactId=${artifactId} \
                                    -Dversion=${version} \
                                    -Dpackaging=jar \
                                    -DgeneratePom=true \
                                    -DrepositoryLayout=default \
                                    -Dusername=$NEXUS_USER \
                                    -Dpassword=$NEXUS_PASS
                            """
                        }
                    }
                }
            }
        }

        stage('Publish Frontend ZIP to Nexus') {
            steps {
                dir('Front-End') {
                    script {
                        withCredentials([usernamePassword(
                            credentialsId: 'nexus-cred',
                            usernameVariable: 'NEXUS_USER',
                            passwordVariable: 'NEXUS_PASS'
                        )]) {

                            def version = "0.0.1-${env.BUILD_NUMBER}"

                            sh """
                                echo "Subiendo FRONTEND ZIP a repo raw..."
                                curl -f -v -u $NEXUS_USER:$NEXUS_PASS \
                                --upload-file frontend.zip \
                                http://nexus:8081/repository/frontend-raw/frontend-${version}.zip
                            """
                        }
                    }
                }
            }
        }

    }

    post {
        success { echo "✅ Pipeline completada correctamente" }
        failure { echo "❌ Algo falló en la pipeline" }
    }
}
