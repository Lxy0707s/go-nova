import styled from 'styled-components';

export const RightPage = styled.div`
  width: 28.75rem;
  height: auto;
  padding: 0px 0.1rem;
`;

export const RightTopBox = styled.div`
  position: relative;
  height: 10rem;
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  .right-top {
    &-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .earth-gif {
      width: 10.75rem;
      height: auto;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 2.25rem;
    }
  }
`;

export const RightCenterBox = styled.div`
  position: relative;
  height: 12.125rem;
  width: 100%;
  margin-top: 1.95rem;
  margin-bottom: 0.05rem;
`;

export const RightBottomBox = styled.div`
  position: relative;
  height: 8rem;
  width: 100%;
  margin-top: 0.05rem;
  .right-bottom-borderBox13 {
    padding: 0.05rem 0.1875rem 0.1875rem;
    .right-bottom {
      width: 98%;
      height: 100%;
      border-radius: 8px;
      background-color: rgba(19, 25, 47, 0.6);
      .feedback-box {
        margin-top: 0.01rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        &-item {
          .dis-text {
            display: flex;
            justify-content: space-around;
            font-weight: bold;
            color: #b2cfee;
            font-size: 0.1rem;
            background: linear-gradient(to bottom, #fff, #6176F4);
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
          }
        }
      }
      .offline-portal-box {
        margin-top: 0.45rem;
      }
    }
  }
`;
