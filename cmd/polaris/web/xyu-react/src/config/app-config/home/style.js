import styled from 'styled-components';
import pageBg from '../../../assets/pageBg.png';

export const IndexPageStyle = styled.div`
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  padding: 20px 0 0 0;
  background: url(${pageBg}) center center no-repeat;
  background-size: cover;
`;
export const IndexPageContent = styled.div`
  display: flex;
  justify-content: center;
  height: 45.75rem;
  width: 97%;
  flex-wrap: nowrap;
  .center-page {
    flex: 1;
  }
`;
