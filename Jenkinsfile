pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node16'
    }

    environment {
        DOCKER_REGISTRY = "nexus:5000"
        IMAGE_NAME = "issuetracking"
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

        // =========================
        // ✅ SUBIR JAR A NEXUS
        // =========================
        stage('Publish Artifact to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {

                    sh '''
                    mkdir -p ~/.m2

                    cat > ~/.m2/settings.xml <<EOF
<settings>
  <servers>
    <server>
      <id>nexus</id>
      <username>${NEXUS_USER}</username>
      <password>${NEXUS_PASS}</password>
    </server>
  </servers>
</settings>
EOF
                    '''

                    dir('Back-End') {
                        sh '''
                        mvn deploy:deploy-file \
                          -DrepositoryId=nexus \
                          -Durl=http://nexus:8081/repository/maven-releases/ \
                          -Dfile=target/issuetracking-0.0.1-SNAPSHOT.jar \
                          -DgroupId=com.mycompany.issuetracking \
                          -DartifactId=issuetracking \
                          -Dversion=1.0.${BUILD_NUMBER} \
                          -Dpackaging=jar \
                          -DgeneratePom=true
                        '''
                    }
                }
            }
        }

        // =====================================
        // ✅ NUEVA ETAPA — DOCKER IMAGE + PUSH
        // =====================================
        stage('Build & Push Docker Image') {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    script {
                        def version = "1.0.${env.BUILD_NUMBER}"
                    }

                    sh '''
                    echo "🐳 Login Docker Nexus"
                    docker login nexus:5000 -u $DOCKER_USER -p $DOCKER_PASS

                    echo "🐳 Construyendo imagen Docker"
                    docker build -t $DOCKER_REGISTRY/$IMAGE_NAME:${BUILD_NUMBER} Back-End

                    echo "🐳 Subiendo imagen a Nexus Docker Registry"
                    docker push $DOCKER_REGISTRY/$IMAGE_NAME:${BUILD_NUMBER}

                    docker logout nexus:5000
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ PIPELINE COMPLETA — Artefacto + Docker Image publicados'
        }
        failure {
            echo '❌ Algo falló'
        }
    }
}
