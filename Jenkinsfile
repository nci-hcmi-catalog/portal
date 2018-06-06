#!groovy
properties([
    pollSCM('H/15 * * * *')
])
pipeline {
  stages{
    stage('Get Code') {
      steps {
          deleteDir()
          checkout ([
              $class: 'GitSCM',
              branches: scm.branches,
              doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
              extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
              userRemoteConfigs: scm.userRemoteConfigs,
           ])
           script {
               tag=sh(returnStdout: true, script: "git tag -l --points-at HEAD").trim()
               env.tag = tag
             }
      }
    }
    stage('GetOpsScripts') {
      steps {
        echo "portal GETTING SCRIPTS"
        sh '''
        git clone git@github.com:ra-ver/hcmi-ops.git
        '''
      }
    }
    stage('Test') {
     steps {
       echo "portal TESTING STARTED: (${env.BUILD_URL})"
       sh '''
       hcmi-ops/ci-scripts/test_stage/test.sh
       '''
       echo "portal TESTING COMPLETED: (${env.BUILD_URL})"
     }
     post {
       failure {
         echo "portal Test Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
    stage('Build') {
      steps {
        sh '''
        hcmi-ops/ci-scripts/build_stage/build.sh
        '''
      }
    }
    stage('Publish') {
      steps {
        sh '''
        hcmi-ops/ci-scripts/publish_stage/publish.sh
        '''
        echo "portal PUSHED IMAGE: (${env.BUILD_URL})"
      }
      post {
        failure {
          echo "portal Publish Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
      }
    }
    stage('Deploy Dev') {
      when {
        expression {
          return env.BRANCH_NAME != 'master';
        }
      }
      steps {
        echo "DEPLOYING TO DEVELOPMENT: (${env.BUILD_URL})"
        sh '''
        hcmi-ops/ci-scripts/deploy_stage/deploy.sh dev
        '''
        echo "portal DEPLOYED TO DEVELOPMENT: (${env.BUILD_URL})"
      }
      post {
        failure {
          echo "portal Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
      }
    }
    stage('Deploy QA') {
      when {
       expression {
           return env.BRANCH_NAME == 'master';
       }
     }
     steps {
       echo "portal DEPLOYING TO QA: (${env.BUILD_URL})"
       sh '''
       hcmi-ops/ci-scripts/deploy_stage/deploy.sh qa
       '''
       echo "portal DEPLOYED TO QA: (${env.BUILD_URL})"
     }
     post {
       failure {
         echo "portal Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
    stage("Promotion portal to PRD") {
      when {
             expression {
               return env.BRANCH_NAME == 'master';
             }
             expression {
               return tag != '';
             }
           }
      steps {
             script {
                     env.DEPLOY_TO_PRD = input message: 'User input required',
                                     submitter: 'vermar',
                                     parameters: [choice(name: 'portal: Deploy to PRD Environment', choices: 'no\nyes', description: 'Choose "yes" if you want to deploy the PRD server')]
             }
     }
    }
    stage('Deploy PRD') {
      when {
       environment name: 'DEPLOY_TO_PRD', value: 'yes'
       expression {
           return env.BRANCH_NAME == 'master';
       }
       expression {
         return tag != '';
       }
     }
     steps {
       echo "portal DEPLOYING TO PRD: (${env.BUILD_URL})"
       sh '''
       hcmi-ops/ci-scripts/deploy_stage/deploy.sh prd
       '''
       echo "portal DEPLOYED TO PRD: (${env.BUILD_URL})"
     }
    }
    stage("Rollback to previous version of the application with DB Rollback") {
      when {
             expression {
               return env.BRANCH_NAME == 'master';
             }
             expression {
               return tag != '';
             }
           }
      steps {
             script {
                     env.ROLLBACK_PRD = input message: 'User input required',
                                     submitter: 'vermar',
                                     parameters: [choice(name: 'portal: Rollback PRD to Previous Version?', choices: 'no\nyes', description: 'Choose "yes" if you want to rollback the PRD deployment to previous stable release')]
             }
     }
    }
    stage('Rollback PRD') {
      when {
       environment name: 'ROLLBACK_PRD', value: 'yes'
       expression {
           return env.BRANCH_NAME == 'master';
       }
       expression {
         return tag != '';
       }
     }
     steps {
       echo "portal DEPLOYING TO PRD: (${env.BUILD_URL})"
       sh '''
       hcmi-ops/ci-scripts/rollback/rollback.sh
       '''
       echo "portal DEPLOYED TO PRD: (${env.BUILD_URL})"
     }
    }
  }
}
