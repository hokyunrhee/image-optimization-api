# Image Optimization Api

AWS에서 제공하는 Dynamic Image Transformation for Amazon CloudFront 솔루션을 사용하여 적은 비용으로 실시간으로 이미지를 변환하고 최적화하여 제공하는 API를 구성합니다.

## 사용자 정의 도메인(CNAME)을 CloudFront Distribution에 연결하는 방법

CloudFront Distribution에 사용자 정의 도메인(예: `image.yourdomain.com`)을 연결하려면 다음 단계를 따르세요.

1. AWS Management Console에서 CloudFront 서비스로 이동하여 해당 Distribution의 설정을 엽니다.
2. 'Settings' 섹션에서 'Edit'을 클릭하고, 'Alternate domain name (CNAME)' 필드에 사용하려는 사용자 정의 도메인을 입력합니다.
3. 'Custom SSL certificate' 섹션에서 해당 도메인에 맞는 SSL 인증서를 선택합니다. **중요:** CloudFront에서 사용자 정의 SSL 인증서를 사용하려면 반드시 `us-east-1` 리전에 생성된 인증서여야 합니다.
4. AWS Management Console에서 Route 53 서비스로 이동합니다.
5. 해당 도메인의 Hosted zone을 선택합니다.
6. 'Create record'를 클릭하여 새 레코드를 생성합니다. 레코드 유형은 'A'를 선택하고, 'Alias' 옵션을 활성화합니다. 'Route traffic to' 옵션에서 'Alias to CloudFront distribution'을 선택한 후, 해당 Distribution을 선택합니다. 마지막으로 'Create records'를 클릭하여 레코드를 생성합니다.

## 솔루션을 구성하는 리소스에 태그를 추가하는 방법

1. [AWS Systems Manager 콘솔](https://console.aws.amazon.com/systems-manager)에 로그인합니다.
2. 왼쪽 탐색 창에서 **Application Manager**를 선택합니다.
3. 애플리케이션 목록에서 `ServerlessImageHandlerStack`을 선택합니다.
4. **Application information** 섹션에서 **Application tags**를 확인합니다.
5. 현재 적용된 태그가 없으면 **Application tags** 값은 0으로 표시됩니다. 숫자 0을 클릭하면 태그를 추가하는 모달 창이 나타납니다.
6. 원하는 태그를 추가한 후 스택을 다시 배포합니다.

## 참고 문서

- [Dynamic Image Transformation for Amazon CloudFront](https://aws.amazon.com/solutions/implementations/dynamic-image-transformation-for-amazon-cloudfront)
