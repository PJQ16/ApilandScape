app.get('/download-excel', async (req, res) => {
    try {
        // หัวตาราง
        const workbook = new ExcelJS.Workbook();
        const worksheet1 = workbook.addWorksheet('Fr-04.1');
        worksheet1.mergeCells('A1:A4');
        worksheet1.mergeCells('B1:AN2');
        const cellB1H2 = worksheet1.getCell('B1:AN2');
        cellB1H2.value = 'บัญชีรายการก๊าซเรือนกระจก';
        worksheet1.mergeCells('AO1:AS1');
        const cellAO1 = worksheet1.getCell('AO1');
        cellAO1.value = 'CFO_R_01'; 
        worksheet1.mergeCells('AO2:AS2');
        const cellAO2 = worksheet1.getCell('AO2');
        cellAO2.value = 'Version 04 : 02/4/2024';
        worksheet1.getCell('B3').value = 'ชื่อฟอร์ม';
        worksheet1.mergeCells('C3:G3');
        worksheet1.getCell('C3:G3').value = 'บัญชีรายการก๊าซเรือนกระจก';
        worksheet1.getCell('H3').value = 'องค์กร';
        worksheet1.mergeCells('I3:AA3');
        worksheet1.getCell('I3:AA3').value = 'สถาบันวิจัยและพัฒนาพลังงานนครพิงค์ มหาวิทยาลัยเชียงใหม่ ';
        worksheet1.mergeCells('AB3:AD3');
        worksheet1.getCell('AB3:AD3').value = 'ปีที่เก็บข้อมูล';
        worksheet1.mergeCells('AE3:AN3');
        worksheet1.getCell('AE3:AN3').value = 'มกราคม - ธันวาคม 2565';
        worksheet1.mergeCells('AO3:AQ3');
        worksheet1.getCell('AO3:AQ3').value = 'หน้าที่';
        worksheet1.mergeCells('AR3:AS3');
        worksheet1.getCell('AR3:AS3').value = '4';
        worksheet1.getCell('B4').value = 'รหัสฟอร์ม';
        worksheet1.mergeCells('C4:G4');
        worksheet1.getCell('C4:G4').value = 'Fr-04.1';
        worksheet1.getCell('H4').value = 'ผู้จัดทำ';
        worksheet1.mergeCells('I4:AA4');
        worksheet1.getCell('I4:AA4').value = 'สถาบันวิจัยและพัฒนาพลังงานนครพิงค์ มหาวิทยาลัยเชียงใหม่ ';
        worksheet1.mergeCells('AB4:AN4');
        worksheet1.mergeCells('AO4:AQ4');
        worksheet1.getCell('AO4:AQ4').value = 'วันที่';
        worksheet1.mergeCells('AR4:AS4');
        worksheet1.getCell('AR4:AS4').value = '';  
        worksheet1.mergeCells('A6:A9');
        worksheet1.getCell('A6').value = 'ขอบเขต';
        worksheet1.mergeCells('B6:B9');
        worksheet1.getCell('B6:B9').value = 'รายการ';
        worksheet1.mergeCells('C6:D8');
        worksheet1.getCell('C6:D8').value = 'ค่าLCI';
        worksheet1.getCell('C9').value = 'หน่วย';
        worksheet1.getCell('D9').value = 'ปริมาณ';
        worksheet1.mergeCells('E6:N7');
        worksheet1.getCell('E6:N7').value = 'GHG ที่ต้องรายงานตามข้อกำหนด';
        worksheet1.mergeCells('E8:L8');
        worksheet1.getCell('E8:L8').value = 'ค่า EF(kg GHG/หน่วย)';
        worksheet1.mergeCells('M8:N8');
        worksheet1.getCell('M8:N8').value = 'GWP₁₀₀';
        worksheet1.getCell('E9').value = 'CO₂';
        worksheet1.getCell('F9').value = 'Fossil CH₄';
        worksheet1.getCell('G9').value = 'CH₄';
        worksheet1.getCell('H9').value = 'N₂O';
        worksheet1.getCell('I9').value = 'SF₆';
        worksheet1.getCell('J9').value = 'NF₃';
        worksheet1.getCell('K9').value = 'HFCs';
        worksheet1.getCell('L9').value = 'PFCs';
        worksheet1.getCell('M9').value = 'HFCs';
        worksheet1.getCell('N9').value = 'PFCs';
        worksheet1.mergeCells('O6:P7');
        worksheet1.getCell('O6:P7').value = 'GHG ที่อยู่นอกข้อกำหนด';
        worksheet1.mergeCells('O8:O9');
        worksheet1.getCell('O8:O9').value = 'ค่า EF (kg GHG/หน่วย)';
        worksheet1.mergeCells('P8:P9');
        worksheet1.getCell('P8:P9').value = 'GWP₁₀₀';
        worksheet1.mergeCells('Q6:Q9');
        worksheet1.getCell('Q6:Q9').value = 'Total (kgCO2e/หน่วย)';
        worksheet1.mergeCells('R6:X6');
        worksheet1.getCell('R6:X6').value = 'ที่มา';
        worksheet1.mergeCells('R7:S7');
        worksheet1.getCell('R7:S7').value = '1st';
        worksheet1.mergeCells('T7:W7');
        worksheet1.getCell('T7:W7').value = '2ed';
        worksheet1.mergeCells('R8:R9');
        const cellR8R9 = worksheet1.getCell('R8');
        cellR8R9.value = 'Self collct';
        cellR8R9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('S8:S9');
        const cellS8S9 = worksheet1.getCell('S8');
        cellS8S9.value = 'Supplier';
        cellS8S9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('T8:T9');
        const cellT8T9 = worksheet1.getCell('T8');
        cellT8T9.value = 'TH LCI DB';
        cellT8T9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('U8:U9');
        const cellU8U9 = worksheet1.getCell('U8');
        cellU8U9.value = 'TGO EF';
        cellU8U9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('V8:V9');
        const cellV8V9 = worksheet1.getCell('V8');
        cellV8V9.value = 'Thai Res.';
        cellV8V9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('W8:W9');
        const cellW8W9 = worksheet1.getCell('W8');
        cellW8W9.value = 'Int. DB';
        cellW8W9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('X7:X9');
        const cellX7X9 = worksheet1.getCell('X7');
        cellX7X9.value = 'Other';
        cellX7X9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('Y6:Y9');
        const cellY6Y9 = worksheet1.getCell('Y6');
        cellY6Y9.value = 'Subsitute';
        cellY6Y9.alignment = {
          textRotation: 90
        };
        worksheet1.mergeCells('Z6:Z9');
        worksheet1.getCell('Z6:Z9').value = 'แหล่งอ้างอิง';
        worksheet1.mergeCells('AA6:AF8');
        worksheet1.getCell('AA6:AF8').value = 'ผลคูณ(Ton GHG)';
        worksheet1.getCell('AA9').value = 'CO₂';
        worksheet1.getCell('AB9').value = 'Fossil CH₄';
        worksheet1.getCell('AC9').value = 'CH₄';
        worksheet1.getCell('AD9').value = 'N₂O';
        worksheet1.getCell('AE9').value = 'SF₆';
        worksheet1.getCell('AF9').value = 'NF₃';
        worksheet1.mergeCells('AG6:AN8');
        worksheet1.getCell('AG6:AN8').value = 'ผลคูณ(TonCO2e)';
        worksheet1.getCell('AG9').value = 'Fossil CH₄';
        worksheet1.getCell('AH9').value = 'CH₄';
        worksheet1.getCell('AI9').value = 'N₂O';
        worksheet1.getCell('AJ9').value = 'SF₆';
        worksheet1.getCell('AK9').value = 'NF₃';
        worksheet1.getCell('AL9').value = 'HFCs';
        worksheet1.getCell('AM9').value = 'PFCs';
        worksheet1.getCell('AN9').value = 'Other';
        worksheet1.mergeCells('AO6:AO9');
        worksheet1.getCell('AO6:AO9').value = 'Total GHG (TonCO2e)';
        worksheet1.mergeCells('AP6:AP9');
        worksheet1.getCell('AP6:AP9').value = 'สัดส่วน(%)';
        worksheet1.mergeCells('AQ6:AQ9');
        worksheet1.getCell('AQ6:AQ9').value = 'สัดส่วน(%) (SCOPE 1 + 2)';
        worksheet1.mergeCells('AR6:AR9');
        worksheet1.getCell('AR6:AR9').value = 'สัดส่วน(%) (SCOPE 1 + 2 + 3)';
        worksheet1.mergeCells('AS6:AS9');
        worksheet1.getCell('AS6:AS9').value = 'คำอธิบายเพิ่มเติม';
        cellB1H2.alignment = { 
          vertical: 'middle', 
          horizontal: 'center' 
        };
        cellB1H2.font = {
          name: 'Tahoma',
          size: 18,
          bold: true
        };
         cellAO1.alignment = { 
            vertical: 'middle',
            horizontal: 'center' 
          };
          cellAO1.font = {
            name: 'Tahoma',
            size: 10,
            bold: true
          };
         cellAO2.alignment = { 
            vertical: 'middle', 
            horizontal: 'center' 
          };
          cellAO2.font = {
            name: 'Tahoma',
            size: 10,
            bold: false
          };
          worksheet1.eachRow(function(row, rowNumber) {
            row.eachCell(function(cell, colNumber) {
                if (rowNumber >= 1 && rowNumber <= 4 && colNumber >= 1 && colNumber <= 45) {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { 
                        vertical: 'middle', 
                        horizontal: 'center' 
                    };
                }
                if (rowNumber >= 6 && rowNumber <= 9 && colNumber >= 1 && colNumber <= 45) {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            });
        });
        for (let rowNum = 6; rowNum <= 9; rowNum++) {
            for (let colNum = 1; colNum <= 45; colNum++) {
                worksheet1.getCell(`${getColumnName(colNum)}${rowNum}`).alignment = {
                    vertical: 'middle', 
                    horizontal: 'center' 
                };
            }
        }
        function getColumnName(colNum) {
            let columnName = '';
            while (colNum > 0) {
                let remainder = colNum % 26;
                if (remainder === 0) {
                    remainder = 26;
                }
                columnName = String.fromCharCode(64 + remainder) + columnName;
                colNum = Math.floor((colNum - 1) / 26);
            }
            return columnName;
        }
        //จบหัวตาราง 

        const ExcelReportInfo = await dataScopeModels.findAll({
            attributes: [
                'name',
                'lci',
                [conn.fn("SUM", conn.col("quantity")), "quantity"],
                'CO2',
                'Fossil_CH4',
                'CH4',
                'N2O',
                'SF6',
                'NF3',
                'HFCs',
                'PFCs',
                'GWP_HFCs',
                'GWP_PFCs',
                'kgCO2e',
                'sources',
            ],
            where: {
                activityperiod_id: 166
            },
            group: ['head_id','name'],
            order: [['head_id', 'ASC']] // Order by 'name' instead of 'id'
        });
        
        // เริ่มที่แถวที่ 10 เนื่องจากเราต้องการเขียนข้อมูลตั้งแต่แถวที่ 10
        let rowNumber = 10;
        
        // วนลูปผ่าน ExcelReportInfo เพื่อเขียนข้อมูลลงใน worksheet1
        ExcelReportInfo.forEach((datascope) => {

            worksheet1.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                    // เพิ่มเส้นขอบที่เฉพาะบางเซลล์เท่านั้น
                    if (rowNumber >= 10 && colNumber >= 1 && colNumber <= 90) {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    }
                });
            });
        

            const cellB = worksheet1.getCell(`B${rowNumber}`);
            cellB.value = datascope.name; // ใช้ชื่อจาก ExcelReportInfo แทนที่จะใช้ datascope.name

            const cellC = worksheet1.getCell(`C${rowNumber}`);
            cellC.value = datascope.lci; 
        
            const cellD = worksheet1.getCell(`D${rowNumber}`);
            cellD.value = datascope.quantity; // ใช้ total_quantity จาก ExcelReportInfo แทนที่จะใช้ datascope.quantity
        
            const cellE = worksheet1.getCell(`E${rowNumber}`);
            cellE.value = datascope.CO2;
            
            const cellF = worksheet1.getCell(`F${rowNumber}`);
            cellF.value = datascope.Fossil_CH4;
        
            const cellG = worksheet1.getCell(`G${rowNumber}`);
            cellG.value = datascope.CH4;
        
            const cellH = worksheet1.getCell(`H${rowNumber}`);
            cellH.value = datascope.N2O;
        
            const cellI = worksheet1.getCell(`I${rowNumber}`);
            cellI.value = datascope.SF6;
        
            const cellJ = worksheet1.getCell(`J${rowNumber}`);
            cellJ.value = datascope.NF3;
        
            const cellK = worksheet1.getCell(`K${rowNumber}`);
            cellK.value = datascope.HFCs;
        
            const cellL = worksheet1.getCell(`L${rowNumber}`);
            cellL.value = datascope.PFCs;
        
            const cellM = worksheet1.getCell(`M${rowNumber}`);
            cellM.value = datascope.GWP_HFCs;
        
            const cellN = worksheet1.getCell(`N${rowNumber}`);
            cellN.value = datascope.GWP_PFCs;
        
            const cellQ = worksheet1.getCell(`Q${rowNumber}`);
            // คำนวณค่า GWP ตามต้องการโดยใช้ข้อมูลจาก datascope
            cellQ.value =  parseFloat(datascope.kgCO2e) + 
            (parseFloat(datascope.CO2) * 1 ) + 
            (parseFloat(datascope.Fossil_CH4) * 30) + 
            (parseFloat(datascope.CH4) *  28) + 
            (parseFloat(datascope.N2O) * 265) + 
            (parseFloat(datascope.SF6) * 23500) + 
            (parseFloat(datascope.NF3) * 16100) + 
            (parseFloat(datascope.HFCs) * parseFloat(datascope.GWP_HFCs)) + 
            (parseFloat(datascope.PFCs) * parseFloat(datascope.GWP_PFCs));
        
            const cellZ = worksheet1.getCell(`Z${rowNumber}`);
            cellZ.value = datascope.sources;
        
            const EF = parseFloat(datascope.kgCO2e) + 
            (parseFloat(datascope.CO2) * 1 ) + 
            (parseFloat(datascope.Fossil_CH4) * 30) + 
            (parseFloat(datascope.CH4) *  28) + 
            (parseFloat(datascope.N2O) * 265) + 
            (parseFloat(datascope.SF6) * 23500) + 
            (parseFloat(datascope.NF3) * 16100) + 
            (parseFloat(datascope.HFCs) * parseFloat(datascope.GWP_HFCs)) + 
            (parseFloat(datascope.PFCs) * parseFloat(datascope.GWP_PFCs));

            const cellAA = worksheet1.getCell(`AA${rowNumber}`);
            cellAA.value = parseFloat(datascope.quantity * datascope.CO2/1000).toFixed(2);

            const cellAB = worksheet1.getCell(`AB${rowNumber}`);
            cellAB.value = parseFloat(datascope.quantity * datascope.Fossil_CH4/1000).toFixed(2);

            const cellAC = worksheet1.getCell(`AC${rowNumber}`);
            cellAC.value = parseFloat(datascope.quantity * datascope.CH4/1000).toFixed(2);

            const cellAD = worksheet1.getCell(`AD${rowNumber}`);
            cellAD.value = parseFloat(datascope.quantity * datascope.N2O/1000).toFixed(2);

            const cellAE = worksheet1.getCell(`AE${rowNumber}`);
            cellAE.value = parseFloat(datascope.quantity * datascope.SF6/1000).toFixed(2);

            const cellAF = worksheet1.getCell(`AF${rowNumber}`);
            cellAF.value = parseFloat(datascope.quantity * datascope.NF3/1000).toFixed(2);

            const cellAG = worksheet1.getCell(`AG${rowNumber}`);
            cellAG.value = parseFloat(datascope.quantity * (datascope.Fossil_CH4 * 30 )/1000).toFixed(2);

            const cellAH = worksheet1.getCell(`AH${rowNumber}`);
            cellAH.value = parseFloat(datascope.quantity * (datascope.CH4 * 28 )/1000).toFixed(2);

            const cellAI = worksheet1.getCell(`AI${rowNumber}`);
            cellAI.value = parseFloat(datascope.quantity * (datascope.N2O * 265 )/1000).toFixed(2);

            const cellAJ = worksheet1.getCell(`AJ${rowNumber}`);
            cellAJ.value = parseFloat(datascope.quantity * (datascope.SF6 * 23500 )/1000).toFixed(2);

            const cellAK = worksheet1.getCell(`AK${rowNumber}`);
            cellAK.value = parseFloat(datascope.quantity * (datascope.NF3 * 16100 )/1000).toFixed(2);

            const cellAL = worksheet1.getCell(`AL${rowNumber}`);
            cellAL.value = parseFloat(datascope.quantity * (datascope.HFCs * datascope.GWP_HFCs )/1000).toFixed(2);

            const cellAM = worksheet1.getCell(`AM${rowNumber}`);
            cellAM.value = parseFloat(datascope.quantity * (datascope.PFCs * datascope.GWP_PFCs )/1000).toFixed(2);

            const cellAO = worksheet1.getCell(`AO${rowNumber}`);
            cellAO.value = parseFloat((datascope.quantity *  EF ) /1000).toFixed(2);
        
            // เพิ่มหมายเลขแถวเพื่อเขียนข้อมูลในแถวถัดไป
            rowNumber++;
        });
        
        // สิ้นสุดของการวนลูป
        


        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error('Error creating Excel file:', error);
        res.status(500).send('Error creating Excel file');
    }
});