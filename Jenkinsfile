pipeline {
  agent any
  stages {
    stage('Clone') {
      steps {
        git(url: scm.userRemoteConfigs[0].url, branch: '$BRANCH_NAME', changelog: true, credentialsId: 'KK-github-key', poll: true)
        sh 'rm src/npoolstore -rf; git submodule update --init --recursive'
      }
    }

    stage('Compile') {
      when {
        expression { BUILD_TARGET == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          set +e
          revlist=`git rev-list --tags --max-count=1`
          rc=$?
          set -e
          if [[ 0 -eq $rc && x"$revlist" != x ]]; then
            tag=`git tag -l | sort -V | tail -n1`
            major=`echo $tag | awk -F '.' '{ print $1 }'`
            minor=`echo $tag | awk -F '.' '{ print $2 }'`
            patch=`echo $tag | awk -F '.' '{ print $3 }'`
            patch=$(( $patch + $patch % 2 + 1 ))
            tag=$major.$minor.$patch
            sed -ri "s#\\\"version(.*)#\\\"version\\\": \\\"$tag\\\",#" package.json
          fi
        '''.stripIndent())

        withCredentials([gitUsernamePassword(credentialsId: 'KK-github-key', gitToolName: 'git-tool')]) {
          sh(returnStdout: false, script: '''
            set +e
            git add package.json
            git commit -m "update package version"
            git push origin $BRANCH_NAME
            set -e
          '''.stripIndent())
        }

        sh(returnStdout: false, script: '''
          set +e
          PATH=/usr/local/bin:$PATH:./node_modules/@quasar/app/bin command quasar
          rc=$?
          set -e
          if [ ! $rc -eq 0 ]; then
            n v16.14.0
            PATH=/usr/local/bin:$PATH npm install --global --registry https://registry.npm.taobao.org yarn
            PATH=/usr/local/bin:$PATH yarn add global quasar-cli@latest
          fi
          PATH=/usr/local/bin:$PATH:./node_modules/@quasar/app/bin yarn install --registry https://registry.npm.taobao.org/
          PATH=/usr/local/bin:$PATH:./node_modules/@quasar/app/bin quasar build
        '''.stripIndent())
      }
    }

    stage('Switch to current cluster') {
      when {
        anyOf {
          expression { BUILD_TARGET == 'true' }
          expression { DEPLOY_TARGET == 'true' }
        }
      }
      steps {
        sh 'cd /etc/kubeasz; ./ezctl checkout $TARGET_ENV'
      }
    }

    stage('Generate docker image for feature') {
      when {
        expression { BUILD_TARGET == 'true' }
        expression { BRANCH_NAME != 'master' }
      }
      steps {
        sh(returnStdout: false, script: '''
          feature_name=`echo $BRANCH_NAME | awk -F '/' '{ print $2 }'`
          docker build -t $DOCKER_REGISTRY/entropypool/procyon-webui-v2:$feature_name .
        '''.stripIndent())
      }
    }

    stage('Generate docker image for development') {
      when {
        expression { BUILD_TARGET == 'true' }
        expression { BRANCH_NAME == 'master' }
      }
      steps {
        sh 'docker build -t $DOCKER_REGISTRY/entropypool/procyon-webui-v2:latest .'
      }
    }

    stage('Tag patch') {
      when {
        expression { TAG_PATCH == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          set +e
          revlist=`git rev-list --tags --max-count=1`
          rc=$?
          set -e
          if [[ 0 -eq $rc && x"$revlist" != x ]]; then
            tag=`git tag -l | sort -V | tail -n1`
            major=`echo $tag | awk -F '.' '{ print $1 }'`
            minor=`echo $tag | awk -F '.' '{ print $2 }'`
            patch=`echo $tag | awk -F '.' '{ print $3 }'`
            case $TAG_FOR in
              testing)
                patch=$(( $patch + $patch % 2 + 1 ))
                ;;
              production)
                patch=$(( $patch + 1 ))
                git reset --hard
                git checkout $tag
                ;;
            esac
            tag=$major.$minor.$patch
          else
            tag=0.1.1
          fi
          sed -ri "s#\\\"version(.*)#\\\"version\\\": \\\"$tag\\\",#" package.json
          set +e
          git add package.json
          git commit -m "Bump version to $tag"
          set -e
          git tag -a $tag -m "Bump version to $tag"
        '''.stripIndent())

        withCredentials([gitUsernamePassword(credentialsId: 'KK-github-key', gitToolName: 'git-tool')]) {
          sh 'git push --tag'
        }
      }
    }

    stage('Tag minor') {
      when {
        expression { TAG_MINOR == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          set +e
          revlist=`git rev-list --tags --max-count=1`
          rc=$?
          set -e
          if [[ 0 -eq $rc && x"$revlist" != x ]]; then
            tag=`git tag -l | sort -V | tail -n1`
            major=`echo $tag | awk -F '.' '{ print $1 }'`
            minor=`echo $tag | awk -F '.' '{ print $2 }'`
            patch=`echo $tag | awk -F '.' '{ print $3 }'`
            minor=$(( $minor + 1 ))
            patch=1
            tag=$major.$minor.$patch
          else
            tag=0.1.1
          fi
          sed -ri "s#\\\"version(.*)#\\\"version\\\": \\\"$tag\\\",#" package.json
          set +e
          git add package.json
          git commit -m "Bump version to $tag"
          set -e
          git tag -a $tag -m "Bump version to $tag"
        '''.stripIndent())

        withCredentials([gitUsernamePassword(credentialsId: 'KK-github-key', gitToolName: 'git-tool')]) {
          sh 'git push --tag'
        }
      }
    }

    stage('Tag major') {
      when {
        expression { TAG_MAJOR == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          set +e
          revlist=`git rev-list --tags --max-count=1`
          rc=$?
          set -e
          if [[ 0 -eq $rc && x"$revlist" != x ]]; then
            tag=`git tag -l | sort -V | tail -n1`
            major=`echo $tag | awk -F '.' '{ print $1 }'`
            minor=`echo $tag | awk -F '.' '{ print $2 }'`
            patch=`echo $tag | awk -F '.' '{ print $3 }'`
            major=$(( $major + 1 ))
            minor=0
            patch=1
            tag=$major.$minor.$patch
          else
            tag=0.1.1
          fi
          sed -ri "s#\\\"version(.*)#\\\"version\\\": \\\"$tag\\\",#" package.json
          set +e
          git add package.json
          git commit -m "Bump version to $tag"
          set -e
          git tag -a $tag -m "Bump version to $tag"
        '''.stripIndent())

        withCredentials([gitUsernamePassword(credentialsId: 'KK-github-key', gitToolName: 'git-tool')]) {
          sh 'git push --tag'
        }
      }
    }

    stage('Generate docker image for testing or production') {
      when {
        expression { BUILD_TARGET == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          tag=`git tag -l | sort -V | tail -n1`
          git reset --hard
          git checkout $tag
          set +e
          PATH=/usr/local/bin:$PATH:./node_modules/@quasar/app/bin command quasar
          rc=$?
          set -e
          if [ ! $rc -eq 0 ]; then
            n v16.14.0
            PATH=/usr/local/bin:$PATH npm install --global --registry https://registry.npm.taobao.org yarn
            PATH=/usr/local/bin:$PATH yarn add global quasar-cli@latest
          fi
          PATH=/usr/local/bin:$PATH:./node_modules/@quasar/app/bin yarn install --registry https://registry.npm.taobao.org/
          PATH=/usr/local/bin:$PATH:./node_modules/@quasar/app/bin quasar build
          docker build -t $DOCKER_REGISTRY/entropypool/procyon-webui-v2:$tag .
        '''.stripIndent())
      }
    }

    stage('Release docker image for feature') {
      when {
        expression { RELEASE_TARGET == 'true' }
        expression { BRANCH_NAME != 'master' }
      }
      steps {
        sh(returnStdout: false, script: '''
          feature_name=`echo $BRANCH_NAME | awk -F '/' '{ print $2 }'`
          set +e
          docker images | grep procyon-webui-v2 | grep $feature_name
          rc=$?
          set -e
          if [ 0 -eq $rc ]; then
            docker push $DOCKER_REGISTRY/entropypool/procyon-webui-v2:$feature_name
          fi
          images=`docker images | grep entropypool | grep procyon-webui-v2 | grep none | awk '{ print $3 }'`
          for image in $images; do
            docker rmi $image -f
          done
        '''.stripIndent())
      }
    }

    stage('Release docker image for development') {
      when {
        expression { RELEASE_TARGET == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          set +e
          docker images | grep procyon-webui-v2 | grep latest
          rc=$?
          set -e
          if [ 0 -eq $rc ]; then
            docker push $DOCKER_REGISTRY/entropypool/procyon-webui-v2:latest
          fi
          images=`docker images | grep entropypool | grep procyon-webui-v2 | grep none | awk '{ print $3 }'`
          for image in $images; do
            docker rmi $image -f
          done
        '''.stripIndent())
      }
    }

    stage('Release docker image for testing') {
      when {
        expression { RELEASE_TARGET == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          tag=`git tag -l | sort -V | tail -n1`

          set +e
          docker images | grep procyon-webui-v2 | grep $tag
          rc=$?
          set -e
          if [ 0 -eq $rc ]; then
            docker push $DOCKER_REGISTRY/entropypool/procyon-webui-v2:$tag
          fi
        '''.stripIndent())
      }
    }

    stage('Release docker image for production') {
      when {
        expression { RELEASE_TARGET == 'true' }
      }
      steps {
        sh(returnStdout: false, script: '''
          tag=`git tag -l | sort -V | tail -n1`

          major=`echo $tag | awk -F '.' '{ print $1 }'`
          minor=`echo $tag | awk -F '.' '{ print $2 }'`
          patch=`echo $tag | awk -F '.' '{ print $3 }'`

          patch=$(( $patch - $patch % 2 ))
          tag=$major.$minor.$patch

          set +e
          docker images | grep procyon-webui-v2 | grep $tag
          rc=$?
          set -e
          if [ 0 -eq $rc ]; then
            docker push $DOCKER_REGISTRY/entropypool/procyon-webui-v2:$tag
          fi
        '''.stripIndent())
      }
    }

    stage('Deploy for feature') {
      when {
        expression { DEPLOY_TARGET == 'true' }
        expression { BRANCH_NAME != 'master' }
      }
      steps {
        sh(returnStdout: false, script: '''
          feature_name=`echo $BRANCH_NAME | awk -F '/' '{ print $2 }'`
          sed -i "s/procyon-webui-v2:latest/procyon-webui-v2:$feature_name/g" k8s/01-procyon-webui.yaml
          sed -i "s/uhub.service.ucloud.cn/$DOCKER_REGISTRY/g" k8s/01-procyon-webui.yaml
          sed -i "s/procyon-vip/${CERT_NAME}/g" k8s/02-ingress.yaml
          sed -i "s/procyon\\.vip/${ROOT_DOMAIN}/g" k8s/02-ingress.yaml
          kubectl apply -k k8s
        '''.stripIndent())
      }
    }

    stage('Deploy for development') {
      when {
        expression { DEPLOY_TARGET == 'true' }
        expression { TARGET_ENV ==~ /.*development.*/ }
        expression { BRANCH_NAME == 'master' }
      }
      steps {
        sh '''
          sed -i "s/uhub.service.ucloud.cn/$DOCKER_REGISTRY/g" k8s/01-procyon-webui.yaml
          sed -i "s/procyon-vip/${CERT_NAME}/g" k8s/02-ingress.yaml
          sed -i "s/procyon\\.vip/${ROOT_DOMAIN}/g" k8s/02-ingress.yaml
          kubectl apply -k k8s
        '''
      }
    }

    stage('Deploy for testing') {
      when {
        expression { DEPLOY_TARGET == 'true' }
        expression { TARGET_ENV ==~ /.*testing.*/ }
        expression { BRANCH_NAME == 'master' }
      }
      steps {
        sh(returnStdout: false, script: '''
          tag=`git tag -l | sort -V | tail -n1`

          git reset --hard
          git checkout $tag
          sed -i "s/procyon-webui-v2:latest/procyon-webui-v2:$tag/g" k8s/01-procyon-webui.yaml
          sed -i "s/uhub.service.ucloud.cn/$DOCKER_REGISTRY/g" k8s/01-procyon-webui.yaml

          sed -i "s/procyon\\.vip/procyon\\.npool\\.top/g" k8s/02-ingress.yaml
          sed -i "s/procyon-vip/procyon-npool-top/g" k8s/02-ingress.yaml
          kubectl apply -k k8s
        '''.stripIndent())
      }
    }

    stage('Deploy for production') {
      when {
        expression { DEPLOY_TARGET == 'true' }
        expression { TARGET_ENV ==~ /.*production.*/ }
      }
      steps {
        sh(returnStdout: false, script: '''
          tag=`git tag -l | sort -V | tail -n1`

          major=`echo $tag | awk -F '.' '{ print $1 }'`
          minor=`echo $tag | awk -F '.' '{ print $2 }'`
          patch=`echo $tag | awk -F '.' '{ print $3 }'`
          patch=$(( $patch - $patch % 2 ))
          tag=$major.$minor.$patch

          git reset --hard
          git checkout $tag
          sed -i "s/procyon-webui-v2:latest/procyon-webui-v2:$tag/g" k8s/01-procyon-webui.yaml
          sed -i "s/uhub.service.ucloud.cn/$DOCKER_REGISTRY/g" k8s/01-procyon-webui.yaml
          kubectl apply -k k8s
        '''.stripIndent())
      }
    }

    stage('Post') {
      steps {
        // Assemble vet and lint info.
        // warnings parserConfigurations: [
        //   [pattern: 'govet.txt', parserName: 'Go Vet'],
        //   [pattern: 'golint.txt', parserName: 'Go Lint']
        // ]

        // sh 'go2xunit -fail -input gotest.txt -output gotest.xml'
        // junit "gotest.xml"
        sh 'echo Posting'
      }
    }
  }
  post('Report') {
    fixed {
      script {
        sh(script: 'bash $JENKINS_HOME/wechat-templates/send_wxmsg.sh fixed')
     }
      script {
        // env.ForEmailPlugin = env.WORKSPACE
        emailext attachmentsPattern: 'TestResults\\*.trx',
        body: '${FILE,path="$JENKINS_HOME/email-templates/success_email_tmp.html"}',
        mimeType: 'text/html',
        subject: currentBuild.currentResult + " : " + env.JOB_NAME,
        to: '$DEFAULT_RECIPIENTS'
      }
     }
    success {
      script {
        sh(script: 'bash $JENKINS_HOME/wechat-templates/send_wxmsg.sh successful')
     }
      script {
        // env.ForEmailPlugin = env.WORKSPACE
        emailext attachmentsPattern: 'TestResults\\*.trx',
        body: '${FILE,path="$JENKINS_HOME/email-templates/success_email_tmp.html"}',
        mimeType: 'text/html',
        subject: currentBuild.currentResult + " : " + env.JOB_NAME,
        to: '$DEFAULT_RECIPIENTS'
      }
     }
    failure {
      script {
        sh(script: 'bash $JENKINS_HOME/wechat-templates/send_wxmsg.sh failure')
     }
      script {
        // env.ForEmailPlugin = env.WORKSPACE
        emailext attachmentsPattern: 'TestResults\\*.trx',
        body: '${FILE,path="$JENKINS_HOME/email-templates/fail_email_tmp.html"}',
        mimeType: 'text/html',
        subject: currentBuild.currentResult + " : " + env.JOB_NAME,
        to: '$DEFAULT_RECIPIENTS'
      }
     }
    aborted {
      script {
        sh(script: 'bash $JENKINS_HOME/wechat-templates/send_wxmsg.sh aborted')
     }
      script {
        // env.ForEmailPlugin = env.WORKSPACE
        emailext attachmentsPattern: 'TestResults\\*.trx',
        body: '${FILE,path="$JENKINS_HOME/email-templates/fail_email_tmp.html"}',
        mimeType: 'text/html',
        subject: currentBuild.currentResult + " : " + env.JOB_NAME,
        to: '$DEFAULT_RECIPIENTS'
      }
     }
  }
}
