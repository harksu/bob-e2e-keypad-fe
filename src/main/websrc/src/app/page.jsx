"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import JSEncrypt from 'jsencrypt';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const InputCirclesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const InputCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isActive ? '#bbb' : '#eee')};
  margin: 0 5px;
`;

const KeypadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 100px);
  grid-template-rows: repeat(3, 100px);
`;

const KeypadButton = styled.button`
  background-image: url(${(props) => props.image});
  background-position: ${(props) => props.position};
  width: 100px;
  height: 100px;
  background-size: 400px 300px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  cursor: pointer;
`;


export default function Page() {
  const [base64Image, setBase64Image] = useState(null);
  const [keyList, setKeyList] = useState([]);
  const [inputValues, setInputValues] = useState([]);

  // const PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtkLA7dcyLqz4M6BS/XZiwMee85fjwskmxfZVN/qI854Sa4mlU/5Rse0HcNY0QoF+J3kQF3xWpTKLfw2p5pztsALLN6gsO2m4qLIOk3eNR+hVL2Rh4dc8MAhuXfoTGrfMjXouiy05rYgVpqIRRCjzMVGYnJ7arZ6rMN73nRxd0I9RVbe3LXEuHrBysxjfXae6z+qb+1Rp9MKnwiDuKC/i2lqqqmV9p/8OuY+qUzsMCtU8URS8kvw/bkg90TEOHzjKWrRIYRcQQkdJ8KuX3/lV1jBBgIQRfmQVTFUnkV5XBZw9jXYTsz6Bcp4MNWUlwHQIebAM8vMZ6/nH9p4OdETA5wIDAQAB"
  const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtkLA7dcyLqz4M6BS/XZi
wMee85fjwskmxfZVN/qI854Sa4mlU/5Rse0HcNY0QoF+J3kQF3xWpTKLfw2p5pzt
sALLN6gsO2m4qLIOk3eNR+hVL2Rh4dc8MAhuXfoTGrfMjXouiy05rYgVpqIRRCjz
MVGYnJ7arZ6rMN73nRxd0I9RVbe3LXEuHrBysxjfXae6z+qb+1Rp9MKnwiDuKC/i
2lqqqmV9p/8OuY+qUzsMCtU8URS8kvw/bkg90TEOHzjKWrRIYRcQQkdJ8KuX3/lV
1jBBgIQRfmQVTFUnkV5XBZw9jXYTsz6Bcp4MNWUlwHQIebAM8vMZ6/nH9p4OdETA
5wIDAQAB
-----END PUBLIC KEY-----
`
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(PUBLIC_KEY)


  const fetchKeyPadData = () => {
    axios
      .get("/api/keypad")
      .then((res) => {
        setBase64Image(res.data.base64Image);
        setKeyList(res.data.keyList); 
        setInputValues([]); 
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchKeyPadData();
  }, []);

  
  const handleClick = (index) => {
    const clickedKey = keyList[index];

    if (clickedKey !== "EMPTY" && inputValues.length < 6) {
      setInputValues([...inputValues, clickedKey]);

      if (inputValues.length === 5) {
        setTimeout(() => {
          const userInput = `${[...inputValues, clickedKey].join("")}`
          window.alert(`${[...inputValues, clickedKey].join()}`);
          console.log(userInput)
          const encryptedUserInput = encrypt.encrypt(userInput || "");
          //여기서 암호화 한 다음에 보내야됨 티비 키길이 2048
          axios.post("api/send-keypad-userInput",{encryptedUserInput}).then((res)=>{
            console.log(res);
            fetchKeyPadData(); 
          }
        ).catch((err)=>console.log(err))
        }, 100);
      }
    }
  };

  const renderButtons = () => {

    const buttons = [];

    if (base64Image && keyList.length === 12) {
      for (let i = 0; i < 12; i++) {
        const position = `${-(i % 4) * 100}px ${-(Math.floor(i / 4)) * 100}px`;
        buttons.push(
          <KeypadButton
            key={i}
            onClick={() => handleClick(i)}
            image={`data:image/png;base64,${base64Image}`}
            position={position}
          />
        );
      }
    }
    return buttons;
  };

  const renderInputCircles = () => {
    return (
      <InputCirclesContainer>
        {Array.from({ length: 6 }).map((_, i) => (
          <InputCircle key={i} $isActive={i < inputValues.length} />
        ))}
      </InputCirclesContainer>
    );
  };

  return (
    <PageContainer>
      {renderInputCircles()}
      <KeypadContainer>
        {renderButtons()}
      </KeypadContainer>
    </PageContainer>
  );

}