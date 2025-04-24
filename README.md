# Image Ooptimization Api

AWS에서 제공하는 Dynamic Image Transformation for Amazon CloudFront 솔루션을 사용하여 적은 비용으로 실시간으로 이미지를 변환하고 최적화하여 제공하는 API를 구성합니다.

## 솔루션을 구성하는 리소스에 태그를 추가하는 방법

1. [AWS Systems Manager 콘솔](https://console.aws.amazon.com/systems-manager)에 로그인합니다.
2. 왼쪽 탐색 창에서 **Application Manager**를 선택합니다.
3. 애플리케이션 목록에서 `ServerlessImageHandlerStack`을 선택합니다.
4. **Application information** 섹션에서 **Application tags**를 확인합니다.
5. 현재 적용된 태그가 없으면 **Application tags** 값은 0으로 표시됩니다. 숫자 0을 클릭하면 태그를 추가하는 모달 창이 나타납니다.
6. 원하는 태그를 추가한 후 스택을 다시 배포합니다.

## 참고 문서

- [Dynamic Image Transformation for Amazon CloudFront](https://docs.aws.amazon.com/ko_kr/solutions/latest/serverless-image-handler/update-the-solution.html)
