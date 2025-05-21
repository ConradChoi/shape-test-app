import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

interface ResultViewProps {
  uploadedImage?: string;
  userInfo?: {
    name: string;
    birthDate: string;
    dominantHand: string;
    occupation: string;
  };
  shapeAnalysis?: {
    firstShape: string;
    secondShape: string;
    thirdShape: string;
    fourthShape: string;
  };
}

const shapeOptions = [
  { value: '', label: '선택' },
  { value: 'circle', label: '○' },
  { value: 'triangle', label: '△' },
  { value: 'square', label: '□' },
  { value: 'star', label: 'S' },
];

const analysisOptions = [
  '미개발', '순수열정', '중복형', '조사형', '몰입형', '천재형',
  '드문형', '콤플렉스', '역동성', '욕구불만', '일자형', '무가치형',
];

const calcAge = (date: string) => {
  if (!date) return '';
  const birth = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `나이: ${isNaN(age) ? '' : age + ' 세'}`;
};

const ResultView: React.FC<ResultViewProps> = ({ uploadedImage, userInfo, shapeAnalysis }) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [state, setState] = useState({
    name: userInfo?.name || '',
    birthDate: userInfo?.birthDate || '',
    age: userInfo?.birthDate ? calcAge(userInfo.birthDate) : '',
    hand: userInfo?.dominantHand || '',
    job: userInfo?.occupation || '',
    notes: '',
    shape1: shapeAnalysis?.firstShape || '',
    shape2: shapeAnalysis?.secondShape || '',
    shape3: shapeAnalysis?.thirdShape || '',
    shape4: shapeAnalysis?.fourthShape || '',
    compositeShape: '',
    primaryShapeAnalysis: '',
    overallAnalysis: '',
    psychologicalIntervention: '',
    plan: '',
    shapeAnalysis: [] as string[],
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: userInfo?.name || '',
      birthDate: userInfo?.birthDate || '',
      age: userInfo?.birthDate ? calcAge(userInfo.birthDate) : '',
      hand: userInfo?.dominantHand || '',
      job: userInfo?.occupation || '',
      shape1: shapeAnalysis?.firstShape || '',
      shape2: shapeAnalysis?.secondShape || '',
      shape3: shapeAnalysis?.thirdShape || '',
      shape4: shapeAnalysis?.fourthShape || '',
    }));
  }, [userInfo, shapeAnalysis]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'birthDate' ? { age: calcAge(value) } : {}),
    }));
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, hand: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setState((prev) => {
      const arr = prev.shapeAnalysis;
      if (checked) {
        return { ...prev, shapeAnalysis: [...arr, value] };
      } else {
        return { ...prev, shapeAnalysis: arr.filter((v) => v !== value) };
      }
    });
  };

  const handleReset = () => setState({
    name: userInfo?.name || '',
    birthDate: userInfo?.birthDate || '',
    age: userInfo?.birthDate ? calcAge(userInfo.birthDate) : '',
    hand: userInfo?.dominantHand || '',
    job: userInfo?.occupation || '',
    notes: '',
    shape1: shapeAnalysis?.firstShape || '',
    shape2: shapeAnalysis?.secondShape || '',
    shape3: shapeAnalysis?.thirdShape || '',
    shape4: shapeAnalysis?.fourthShape || '',
    compositeShape: '',
    primaryShapeAnalysis: '',
    overallAnalysis: '',
    psychologicalIntervention: '',
    plan: '',
    shapeAnalysis: [] as string[],
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 20 }}>
      <h1 style={{ textAlign: 'center' }}>도형심리 검사분석표</h1>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label>검사지 업로드:</label>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              {uploadedImage ? (
                <img src={uploadedImage} alt="미리보기" style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
              ) : (
                <div style={{ width: 150, height: 150, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>이미지 없음</div>
              )}
            </div>
          </div>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>성명</th>
                  <td style={{ width: '70%' }}><input type="text" name="name" value={state.name} onChange={handleChange} style={{ width: '100%' }} /></td>
                </tr>
                <tr>
                  <th>생년월일</th>
                  <td>
                    <input type="date" name="birthDate" value={state.birthDate} onChange={handleChange} style={{ width: '100%' }} />
                    <br />
                    <span>{state.age}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>자주 사용하는 손</th>
                  <td style={{ width: '70%' }}>
                    <label><input type="radio" name="hand" value="right" checked={state.hand === 'right'} onChange={handleRadio} /> 오른손</label>
                    <label style={{ marginLeft: 10 }}><input type="radio" name="hand" value="left" checked={state.hand === 'left'} onChange={handleRadio} /> 왼손</label>
                  </td>
                </tr>
                <tr>
                  <th>직업</th>
                  <td><input type="text" name="job" value={state.job} onChange={handleChange} style={{ width: '100%' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>행동관찰</th>
                  <td style={{ width: '70%' }}>
                    <textarea name="notes" value={state.notes} onChange={handleChange} rows={3} style={{ width: '100%' }} placeholder="행동관찰 내용을 입력하세요." />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
              <tbody>
                <tr>
                  <th>1차 도형</th>
                  <td>
                    <select name="shape1" value={state.shape1} onChange={handleChange} style={{ width: '100%' }}>
                      {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <th>2차 도형</th>
                  <td>
                    <select name="shape2" value={state.shape2} onChange={handleChange} style={{ width: '100%' }}>
                      {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
              <tbody>
                <tr>
                  <th>3차 도형</th>
                  <td>
                    <select name="shape3" value={state.shape3} onChange={handleChange} style={{ width: '100%' }}>
                      {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <th>4차 도형</th>
                  <td>
                    <select name="shape4" value={state.shape4} onChange={handleChange} style={{ width: '100%' }}>
                      {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 40 }}>
            <div style={{ margin: '20px 0' }}>
              <h2>성격</h2>
              <textarea name="compositeShape" value={state.compositeShape} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="성격 분석 내용을 입력하세요." />
            </div>
            <div style={{ margin: '20px 0' }}>
              <h2>주 도형(1차 도형) 분석</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <tbody>
                  {isMobile ? (
                    [0, 1, 2].map(row => (
                      <tr key={row}>
                        {analysisOptions.slice(row * 4, row * 4 + 4).map(opt => (
                          <td key={opt}><label><input type="checkbox" value={opt} checked={state.shapeAnalysis.includes(opt)} onChange={handleCheckbox} /> {opt}</label></td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    [0, 1].map(row => (
                      <tr key={row}>
                        {analysisOptions.slice(row * 6, row * 6 + 6).map(opt => (
                          <td key={opt}><label><input type="checkbox" value={opt} checked={state.shapeAnalysis.includes(opt)} onChange={handleCheckbox} /> {opt}</label></td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <textarea name="primaryShapeAnalysis" value={state.primaryShapeAnalysis} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="주 도형 분석 내용을 입력하세요." />
            </div>
            <div style={{ margin: '20px 0' }}>
              <h2>전체 분석</h2>
              <textarea name="overallAnalysis" value={state.overallAnalysis} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="전체 분석 내용을 입력하세요." />
            </div>
            <div style={{ margin: '20px 0' }}>
              <h2>심리학적 개입</h2>
              <textarea name="psychologicalIntervention" value={state.psychologicalIntervention} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="심리학적 개입 내용을 입력하세요." />
            </div>
            <div style={{ margin: '20px 0' }}>
              <h2>방안/향후 진행</h2>
              <textarea name="plan" value={state.plan} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="방안 및 향후 진행 내용을 입력하세요." />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <label>검사지 업로드:</label>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              {uploadedImage ? (
                <img src={uploadedImage} alt="미리보기" style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
              ) : (
                <div style={{ width: 150, height: 150, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>이미지 없음</div>
              )}
            </div>
          </div>
          <div>
            <div style={{ margin: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <tbody>
                  <tr>
                    <th style={{ width: '25%' }}>성명</th>
                    <td style={{ width: '25%' }}><input type="text" name="name" value={state.name} onChange={handleChange} style={{ width: '100%' }} /></td>
                    <th style={{ width: '25%' }}>생년월일</th>
                    <td style={{ width: '25%' }}>
                      <input type="date" name="birthDate" value={state.birthDate} onChange={handleChange} style={{ width: '100%' }} />
                      <br />
                      <span style={{}}>{state.age}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ margin: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <tbody>
                  <tr>
                    <th style={{ width: '25%' }}>자주 사용하는 손</th>
                    <td style={{ width: '25%' }}>
                      <label><input type="radio" name="hand" value="right" checked={state.hand === 'right'} onChange={handleRadio} /> 오른손</label>
                      <label style={{ marginLeft: 10 }}><input type="radio" name="hand" value="left" checked={state.hand === 'left'} onChange={handleRadio} /> 왼손</label>
                    </td>
                    <th style={{ width: '25%' }}>직업</th>
                    <td style={{ width: '25%' }}><input type="text" name="job" value={state.job} onChange={handleChange} style={{ width: '100%' }} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ margin: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <tbody>
                  <tr>
                    <th style={{ width: '25%' }}>행동관찰</th>
                    <td style={{ width: '75%' }}>
                      <textarea name="notes" value={state.notes} onChange={handleChange} rows={3} style={{ width: '100%' }} placeholder="행동관찰 내용을 입력하세요." />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ margin: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <tbody>
                  <tr>
                    <th>1차 도형</th>
                    <td>
                      <select name="shape1" value={state.shape1} onChange={handleChange} style={{ width: '100%' }}>
                        {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </td>
                    <th>2차 도형</th>
                    <td>
                      <select name="shape2" value={state.shape2} onChange={handleChange} style={{ width: '100%' }}>
                        {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>3차 도형</th>
                    <td>
                      <select name="shape3" value={state.shape3} onChange={handleChange} style={{ width: '100%' }}>
                        {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </td>
                    <th>4차 도형</th>
                    <td>
                      <select name="shape4" value={state.shape4} onChange={handleChange} style={{ width: '100%' }}>
                        {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 40 }}>
              <div style={{ margin: '20px 0' }}>
                <h2>성격</h2>
                <textarea name="compositeShape" value={state.compositeShape} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="성격 분석 내용을 입력하세요." />
              </div>
              <div style={{ margin: '20px 0' }}>
                <h2>주 도형(1차 도형) 분석</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                  <tbody>
                    {[0, 1].map(row => (
                      <tr key={row}>
                        {analysisOptions.slice(row * 6, row * 6 + 6).map(opt => (
                          <td key={opt}><label><input type="checkbox" value={opt} checked={state.shapeAnalysis.includes(opt)} onChange={handleCheckbox} /> {opt}</label></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <textarea name="primaryShapeAnalysis" value={state.primaryShapeAnalysis} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="주 도형 분석 내용을 입력하세요." />
              </div>
              <div style={{ margin: '20px 0' }}>
                <h2>전체 분석</h2>
                <textarea name="overallAnalysis" value={state.overallAnalysis} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="전체 분석 내용을 입력하세요." />
              </div>
              <div style={{ margin: '20px 0' }}>
                <h2>심리학적 개입</h2>
                <textarea name="psychologicalIntervention" value={state.psychologicalIntervention} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="심리학적 개입 내용을 입력하세요." />
              </div>
              <div style={{ margin: '20px 0' }}>
                <h2>방안/향후 진행</h2>
                <textarea name="plan" value={state.plan} onChange={handleChange} rows={5} style={{ width: '100%' }} placeholder="방안 및 향후 진행 내용을 입력하세요." />
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={handleReset} style={{ margin: 5, padding: '10px 20px', fontSize: 16 }}>초기화</button>
        <button style={{ margin: 5, padding: '10px 20px', fontSize: 16, display: 'none' }}>PDF 다운로드</button>
        <button onClick={() => window.print()} style={{ margin: 5, padding: '10px 20px', fontSize: 16 }}>인쇄</button>
      </div>
    </div>
  );
};

export default ResultView; 