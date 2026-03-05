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

        // =====================
        // FRONTEND
        // =====================
        stage('Build Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                    echo "📦 Instalando dependencias..."
                    npm ci --legacy-peer-deps

                    echo "🏗️ Build Angular..."
                    npm run build
                    '''
                }
            }
        }

        stage('Package Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                    echo "📦 Creando ZIP..."
                    rm -f angular-${BUILD_NUMBER}.zip
                    npx bestzip angular-${BUILD_NUMBER}.zip dist
                    '''
                }
            }
        }

        stage('Publish Angular to Nexus') {
            steps {
                dir('Front-End') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh '''
                        echo "🚀 Subiendo Angular a Nexus RAW..."

                        curl -u $NEXUS_USER:$NEXUS_PASS \
                          --upload-file angular-${BUILD_NUMBER}.zip \
                          http://nexus:8081/repository/raw-angular-dist/angular-${BUILD_NUMBER}.zip
                        '''
                    }
                }
            }
        }

        // =====================
        // BACKEND
        // =====================
        stage('Build Backend') {
            steps {
                dir('Back-End') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Publish Backend') {
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
                        echo "🚀 Deployando backend a Nexus..."

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
    }

    post {
        success {
            echo '✅ TODO PUBLICADO EN NEXUS'
        }
        failure {
            echo '❌ FALLÓ EL PIPELINE'
        }
    }
}
