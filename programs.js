/* ===== 프로그램 등록 목록 =====
   프로그램을 추가하려면 아래 배열에 { } 한 덩어리를 추가하세요. (쉼표 주의)
   삭제하려면 해당 덩어리를 지우면 됩니다.

   공통 항목:  id(영문·숫자, 중복 금지), name, category, type, desc, version
   type: "web"     → "file": "programs/파일명.html"        (틀 안에서 바로 실행)
   type: "link"    → "url": "https://..."                  (새 창으로 열기)
   type: "command" → "run": "실행 명령", "in": "입력", "out": "출력", "memo": "사용법"
                                                           (명령 복사용. 웹에서 PC 파일을 직접 실행할 수는 없음)
*/
window.PROGRAMS = [
  { id: "crackwidth", name: "균열폭", category: "현장 측정", type: "web", file: "programs/crackwidth.html",
    desc: "균열폭 측정값 연속 입력, 최대·평균, 등급 경계값 판정", version: "1.0" },
  { id: "crackdepth", name: "균열깊이", category: "현장 측정", type: "web", file: "programs/crackdepth.html",
    desc: "초음파 전달시간(Tc, To)으로 균열깊이 산정", version: "1.0" },
  { id: "rebound", name: "반발경도", category: "현장 측정", type: "web", file: "programs/rebound.html",
    desc: "슈미트해머 측정값 처리(±20% 제외), 보정, 강도 환산", version: "1.0" },
  { id: "carbonation", name: "탄산화", category: "현장 측정", type: "web", file: "programs/carbonation.html",
    desc: "탄산화 깊이 평균, 속도계수 A, 피복 도달 시기 예측", version: "1.0" },
  { id: "ultrasonic", name: "초음파 강도추정", category: "현장 측정", type: "web", file: "programs/ultrasonic.html",
    desc: "초음파 전달속도 산정 및 강도 환산(계수 직접 입력)", version: "1.0" }

  /* ---- 아래는 등록 예시입니다. 쓰려면 이 줄과 맨 아래 닫는 줄(별표+슬래시)을 지우세요 ----
  ,{ id: "merge", name: "외관조사망도 합본", category: "외관조사망도", type: "command",
    run: "python C:/tools/merge.py", desc: "여러 장 PDF를 도면번호순으로 합본", version: "1.0",
    in: "PDF 여러 장", out: "PDF 1개", memo: "터미널에 붙여넣어 실행" }
  ,{ id: "fms", name: "FMS", category: "링크", type: "link", url: "https://www.fms.go.kr", desc: "시설물통합정보관리시스템", version: "-" }
  ,{ id: "lisp1", name: "손상물량 LISP", category: "AutoCAD", type: "command",
    run: "(load \"C:/tools/damage_qty.lsp\")", desc: "AutoCAD 명령창에 붙여넣기", version: "1.0",
    in: "도면", out: "물량표", memo: "경로는 슬래시(/)로 적습니다" }
  ------------------------------------------------------------ */
];
