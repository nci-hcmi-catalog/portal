#!groovy
properties([
    pipelineTriggers([
        pollSCM('H/5 * * * *')
    ])
])
pipeline {
  agent any
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
    stage('Build') {
      steps {
        sh '''
        hcmi-ops/ci-scripts/build_stage/build.sh
        '''
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
        sshPublisher(publishers: [
          sshPublisherDesc(
            configName: 'hcmi-dev', 
            transfers: [
              sshTransfer(
                excludes: '', 
                execCommand: './deploy.sh dev $BUILD_NUMBER', 
                execTimeout: 120000, 
                flatten: false, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: '/deploy/$BUILD_NUMBER', 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: 'portal.tar, hcmi-ops/ci-scripts/deploy_stage/deploy.sh')], 
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: false)
          ])
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
       sshPublisher(publishers: [
          sshPublisherDesc(
            configName: 'hcmi-qa', 
            transfers: [
              sshTransfer(
                excludes: '', 
                execCommand: './deploy.sh qa $BUILD_NUMBER', 
                execTimeout: 120000, 
                flatten: false, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: '/deploy/$BUILD_NUMBER', 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: 'portal.tar, hcmi-ops/ci-scripts/deploy_stage/deploy.sh')],  
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: false)
          ])
        
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
       sshPublisher(publishers: [
          sshPublisherDesc(
            configName: 'hcmi-prd', 
            transfers: [
              sshTransfer(
                excludes: '', 
                execCommand: './deploy.sh prd $BUILD_NUMBER', 
                execTimeout: 120000, 
                flatten: false, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: '/deploy/$BUILD_NUMBER', 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: 'portal.tar, hcmi-ops/ci-scripts/deploy_stage/deploy.sh')], 
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: false)
          ])
        
       echo "portal DEPLOYED TO PRD: (${env.BUILD_URL})"
     }
    }
  }
}
