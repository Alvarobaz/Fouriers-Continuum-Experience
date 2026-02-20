pipeline {
    agent any

    tools {
        maven 'Maven'           // Maven configurado en Jenkins
        jdk 'JDK21'             // Usa el JDK que tengas configurado (ajusta el nombre si es distinto)
    }

    stages {

        stage('SCM') {
            steps {
                echo 'Obteniendo código desde Git...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Compilando proyecto Java con Maven...'
                sh 'mvn clean compile'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Analizando calidad con SonarQube...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.java.binaries=target/classes
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado correctamente ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}
