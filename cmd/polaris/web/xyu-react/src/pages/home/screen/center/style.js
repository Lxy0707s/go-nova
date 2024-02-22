import styled from 'styled-components';

export const CenterPage = styled.div`
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CenterBottom = styled.div`
  display: flex;
  margin-bottom: 0.25rem;
  margin-top: 2.75rem;
  width: 100%;
  height: 7.25rem;
  justify-content: center;
  .detail-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 94%;
    &-item {
      height: 5.25rem;
      width: 30.375%;
      padding: 0 0.125rem;
      margin-top: 0.645rem;
      margin-right: 0.625rem;
      display: flex;
      align-items: center;
      position: relative;
      border-radius: 5px;
      border: 1px solid #343f4b;
      background-color: rgba(19, 25, 47, 0.8);
      img {
        width: 2.35rem;
        height: 2.95rem;
      }
      .detail-item-text {
        margin-left: 0.125rem;
        .text-style {
          color: #bcdcff;
          font-size: 0.08rem;
          margin-bottom: 0.05rem;
          margin-left: 1.01rem;
        }
        span {
          font-weight: 600px;
          font-size: 0.40rem;
          font-weight: bolder;
          margin-left: 1.01rem;
          background: linear-gradient(to bottom, #fff, #4db6e5);
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
        }
        .unit {
          font-size: 0.14rem;
          margin-left: 0.25rem;
        }
      }
    }
  }
`;
