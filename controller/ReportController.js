const express = require('express')
const app = express();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const conn = require('../connect/con');
const {ReportModel} =  require('../models/reportModel');
const {dataScopeModels, GwpModels, HeadCategoryModels} = require('../models/categoryScope')
const { drawTable } = require('pdfkit-table');
const { QueryTypes } = require('sequelize');
const { CampusModels, PlaceCmuModels } = require('../models/placeAtCmuModels');
const { ActivityGHGModel } = require('../models/activityYear');
const { ImageFileModel } = require('../models/imageFileModel');
const striptags = require('striptags');

const eliteral = conn.literal('(CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs)');

/**
 * @swagger
 * /download-excel/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Report]
*/
app.get('/download-excel/:id', async (req, res) => {
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
                activityperiod_id: req.params.id
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

            let scope; // ประกาศตัวแปร scope ที่นอกเครื่องหมายปีกกาของ if เพื่อให้สามารถเข้าถึงได้ทุกที่ในฟังก์ชัน

            if (datascope.head_id <= 7 || (datascope.head_id >= 24 && datascope.head_id <= 28)) {
                scope = 'scope1';
            } else if (datascope.head_id === 8) {
                scope = 'scope2';
            } else if (datascope.head_id >= 9 && datascope.head_id <= 23) {
                scope = 'scope3';
            } else if(datascope.head_id >= 30  && datascope.head_id <= 33){
                scope = 'รายงานแยก';
            }

            
            const cellA = worksheet1.getCell(`A${rowNumber}`);
            cellA.value = scope;

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
        
            const cellU = worksheet1.getCell(`U${rowNumber}`);
            cellU.value = '●';
        

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

            const cellAP = worksheet1.getCell(`AP${rowNumber}`);
            cellAP.value = '';

            const cellAQ = worksheet1.getCell(`AQ${rowNumber}`);
            cellAQ.value = '';

            const cellAR = worksheet1.getCell(`AR${rowNumber}`);
            cellAR.value = '';

            const cellAS = worksheet1.getCell(`AS${rowNumber}`);
            cellAS.value = '';
            
        
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

/**
 * @swagger
 * /report/dipictDataReport/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Report]
*/
//แสดงข้อมูล report 
app.get('/report/dipictDataReport/:id',async(req,res)=>{
    try {
        const ShowData =  await ReportModel.findAll({
            where:{
                activityPeriod_id:req.params.id
            }
        })

        res.status(200).json(ShowData);
    } catch (e) {
        res.status(500).json('Server Error ' + e.message);
    }
})

/**
 * @swagger
 * /generate-pdf:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Report]
*/
app.get('/generate-pdf', async(req, res) => {

    const doc = new PDFDocument({ size: 'a4' });

    // กำหนด Header เพื่อบอกว่าส่ง PDF กลับไปให้ Client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cfo.pdf"');

    // ส่งเอกสาร PDF กลับไปยัง Client
    doc.pipe(res);

    // แก้ไข font ให้ใช้ฟอนต์ TH Sarabun New
    doc.font('./font/THSarabunNew.ttf');

    // เพิ่มข้อความหัวของหน้ากระดาษ
    doc.fontSize(32).text('รายงานการปล่อยและดูดกลับก๊าซเรือนกระจก', { align: 'center', y: 0, bold: true });
    doc.fontSize(32).text('ขององค์กร', { align: 'center', y: 0, bold: true });

    // กำหนดขอบของกรอบรูป

    const ShowData = await CampusModels.findAll(
        {
            attributes:['id','campus_name'],
            where:{
                id:'MH'
            },
            include:[
                {
                    model:PlaceCmuModels,
                    attributes:['id','fac_name'],
                    where:{
                        id:'MH2009'
                    },
                    include:[
                        {
                            model:ActivityGHGModel,
                            attributes:['years'],
                            where:{
                                years:2023
                            },
                            include:[
                                {
                                    model:ImageFileModel,
                                    attributes:['type_fr','file_name']
                                },
                                {
                                    model:ReportModel,
                                    attributes:['intro','tester','coordinator','responsible','monitor','assurance','materially','explanation','cfo_operation1','cfo_operation2','cfo_operation3','image_name']

                                }
                                
                            ]
                        }
                    ]
                }
            ]
        }
    )
    const today = new Date();

    const result = today.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

    ShowData.forEach((item) =>{
        item.faculties.forEach((fac) =>{
            fac.activityperiods.forEach(period => {
                period.reports.forEach((report) =>{
    // เพิ่มข้อความรูปภาพอยู่ในกรอบรูป
    doc.image(`images/${report.image_name}`, {
        fit: [530, 300], // Fit the image into the specified dimensions
        align: 'center', // Align the image to the center of the rectangle
        valign: 'center', // Vertically align the image to the center of the rectangle
        x: 40, // X-coordinate of the image
        y: 160 // Y-coordinate of the image
    });

    doc.fontSize(22).text('ชื่อองค์กร:', 50, 490);
    doc.fontSize(20).text(`${fac.fac_name}`, 110, 492);

    doc.fontSize(22).text('ที่อยู่:', 50, 520);
    doc.fontSize(20).text(`${item.campus_name} `, 80, 522);

    doc.fontSize(22).text('วันที่รายงานผล:', 50, 550);
    doc.fontSize(20).text(`${result}`, 145, 552);

    doc.fontSize(22).text('ระยะในการติดตามผล:', 50, 580);
    doc.fontSize(20).text(`1 ม.ค. ${period.years + 543}  -  31 ธ.ค.  ${period.years + 543} `, 180, 582);

    doc.fontSize(27).text('เพื่อการทวนสอบและรับรองผลคาร์บอนฟุตพริ้นท์ขององค์กร',100, 640);
    doc.fontSize(26).text(' โดย องค์การบริหารจัดการก๊าซเรือนกระจก (องค์การมหาชน)',100, 670);
    });
    });
});
})
    // เพิ่มหน้าใหม่ที่นี่
    //หน้าแรก
    doc.addPage();   
    const tableTop = 20;
    const tableLeft = 10;
    const columnWidth1 = 400;
    const lineHeight = 20;
    const headerColor = '#000000';
    
    const tableTop2 = 20;
    const tableLeft2 = 410;
    const columnWidth2 = 170;
    
    
    const tableTop3 = 40;
    const tableLeft3 = 10;
    const columnWidth3 = 190;
    
    const tableTop4 = 60;
    const tableLeft4 = 10;
    const columnWidth4 = 190;
    
    doc.on('pageAdded', () => {
        // เรียกใช้ฟังก์ชันสร้างตาราง
        createTable(doc, tableTop, tableLeft);
    });

    // สร้างตาราง
    doc.on('pageAdded', () => {
        // เรียกใช้ฟังก์ชันสร้างตาราง
        createTable(doc, tableTop, tableLeft);
    });
    
    // สร้างตาราง
    function createTable(doc, tableTop, tableLeft) {
        // Calculate the space distance between the content and the header
        const spaceDistance = lineHeight * 2; // Adjust this value according to your needs
    
        // Draw the header and content with the calculated space distance
        drawHeader(doc, tableTop, tableLeft, spaceDistance);
        drawContent(doc, tableTop, tableLeft, spaceDistance);
    }
    
    function drawHeader(doc, tableTop, tableLeft, spaceDistance) {
        ShowData.forEach((item) =>{
            item.faculties.forEach((fac) =>{
                fac.activityperiods.forEach(period => {
                    period.reports.forEach((report)=>{
        doc.rect(tableLeft, tableTop, columnWidth1, lineHeight).stroke(headerColor);
        doc.fontSize(16).text('รายงานการปล่อยและดูดกลับก๊าซเรือนกระจกขององค์กร', tableLeft, tableTop, { width: columnWidth1, align: 'center' });
    
        doc.rect(tableLeft2, tableTop2, columnWidth2, lineHeight).stroke(headerColor);
        doc.fontSize(14).text('TCFO_R_02 Version 03: 24/4/2019', tableLeft2, tableTop2, { width: columnWidth2, align: 'center' });
    
        doc.rect(tableLeft3, tableTop3, columnWidth3, lineHeight).stroke(headerColor);
        doc.fontSize(10).text('องค์กร', tableLeft3, tableTop3, { width: columnWidth3, align: 'center' });
    
        doc.rect(tableLeft3 + columnWidth3, tableTop3, columnWidth3, lineHeight).stroke(headerColor);
        doc.fontSize(10).text(`${fac.fac_name}`, tableLeft3 + columnWidth3, tableTop3, { width: columnWidth3, align: 'center' });
    
        doc.rect(tableLeft3 + (columnWidth3 * 2), tableTop3, columnWidth3, lineHeight).stroke(headerColor);
        doc.fontSize(10).text('หน้าที่', tableLeft3 + (columnWidth3 * 2), tableTop3, { width: columnWidth3, align: 'center' });
    
        doc.rect(tableLeft4, tableTop4, columnWidth4, lineHeight).stroke(headerColor);
        doc.fontSize(10).text('หน่วยงานทดสอบ', tableLeft4, tableTop4, { width: columnWidth4, align: 'center' });
    
        doc.rect(tableLeft4 + columnWidth4, tableTop4, columnWidth4, lineHeight).stroke(headerColor);
        doc.fontSize(10).text(`${report.tester}`, tableLeft4 + columnWidth4, tableTop4, { width: columnWidth3, align: 'center' });
    
        doc.rect(tableLeft4 + (columnWidth4 * 2), tableTop4, columnWidth4, lineHeight).stroke(headerColor);
        doc.fontSize(10).text('', tableLeft4 + (columnWidth4 * 2), tableTop4, { width: columnWidth4, align: 'center' });
    });
});
});
});
    }
    
    function drawContent(doc, tableTop, tableLeft, spaceDistance) {
        const contentTop = tableTop + spaceDistance;
    
        doc.fontSize(22).text(`
        `, { bold: true });
        doc.fontSize(16).text(`
        `, tableLeft, contentTop, { width: 500 });
    }
    
    // เรียกใช้ฟังก์ชันสร้างตาราง
    createTable(doc, tableTop, tableLeft);   
//จบหัวตาราง 
doc.fontSize(22).text('1.บทนำ', 20, 100);

// Iterate through ShowData and draw the reports
ShowData.forEach((item) => {
    item.faculties.forEach((fac) => {
        fac.activityperiods.forEach(period => {
            period.reports.forEach((report) => {
                const cleanIntro = striptags(report.intro);
                doc.fontSize(16).text(cleanIntro);
            });
        });
    });
});

// Move to the position for the second section and draw the title
doc.moveTo(20, doc.y + 20); // Move cursor to the position for the next section
doc.addPage(); // Add a new page if needed
doc.fontSize(22).text('2.ข้อมูลทั่วไป', { bold: true });

// Constants for the table
const columnWidths = 250; // Width of each column
const lineHeights = 20; // Height of each row
const headerColors = '#000000'; // Header color

// Function to draw a cell in the table
function drawCell(x, y, width, text) {
    doc.rect(x, y, width, lineHeights).stroke(headerColors);
    doc.fontSize(16).text(text, x + 5, y + 5);
}

// Draw the table using repeated code with adjusted X positions for adjacent cells
const cellSpacing = 10; // Spacing between cells
ShowData.forEach((item) => {
    item.faculties.forEach((fac) => {
        fac.activityperiods.forEach(period => {
            period.reports.forEach((report) => {
drawCell(50, 150, columnWidths, '2.1 ชื่อองค์กร');
drawCell(40 + columnWidths + cellSpacing, 150, columnWidths,  `${fac.fac_name}`);

drawCell(50, 150 + lineHeights, columnWidths, '2.2 ที่อยู่ / สถานที่ตั้งองค์กร');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights, columnWidths, `${item.campus_name} ${fac.fac_name}`);

drawCell(50, 150 + lineHeights * 2, columnWidths, '2.3 ประเภทของอุตสาหกรรม ');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights * 2, columnWidths, `สถานศึกษา`);

drawCell(50, 150 + lineHeights * 3, columnWidths, '2.4 ชื่อ-สกุลของผู้ประสานงาน ');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights * 3, columnWidths, `${report.coordinator}`);

drawCell(50, 150 + lineHeights * 4, columnWidths, '2.5 ชื่อ-สกุลของผู้รับผิดชอบข้อมูล ');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights * 4, columnWidths, `${report.responsible}`);

drawCell(50, 150 + lineHeights * 5, columnWidths, '2.6 ระยะเวลาติดตามผล');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights * 5, columnWidths, `1 ม.ค. ${period.years + 543} - 31 ธ.ค. ${period.years + 543}`);

drawCell(50, 150 + lineHeights * 6, columnWidths, '2.7 แนวทางที่ใช้ในการติดตามผล ');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights * 6, columnWidths, `${report.monitor}`);

drawCell(50, 150 + lineHeights * 7, columnWidths, '2.8 ระดับของการรับรอง (Level of Assurance)');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights * 7, columnWidths, `${report.assurance}`);

drawCell(50, 150 + lineHeights * 8, columnWidths, '2.9 ระดับความมีสระสำคัญ (Materiality Threshold) ');
drawCell(40 + columnWidths + cellSpacing, 150 + lineHeights * 8, columnWidths, `${report.materially}`);
            });
        });
    });
});
    //จบบทนำ 
    //หน้าสอง 
    doc.addPage();  

    doc.fontSize(22).text('3.ขอบเขต', 20, 100);
    doc.fontSize(20).text('3.1 ขอบเขตขององค์กร');
    
    // Constants for the table
    const columnWidths2 = 250; // Width of each column
    const lineHeights2 = 20; // Height of each row
    const headerColors2 = '#000000'; // Header color
    
    // Function to draw a cell in the table
    function drawCell2(x, y, width, text) {
        doc.rect(x, y, width, lineHeights2).stroke(headerColors2);
        doc.fontSize(16).text(text, x + 5, y + 5);
    }
    
    // Draw the table using drawCell function
    // First Row
    drawCell2(50, 150, columnWidths2, '1. แนวทางที่ใช้กำหนดขอบเขตองค์กร');
    drawCell2(40 + columnWidths2 + 10, 150, columnWidths2, 'Cell 1,2');
    
    // Second Row
    drawCell2(50, 150 + lineHeights2, columnWidths2, '2. หน่วยสาธารณูปโภค ');
    drawCell2(40 + columnWidths2 + 10, 150 + lineHeights2, columnWidths2, 'Cell 2,2');
    
    // Third Row
    drawCell2(50, 150 + lineHeights2 * 2, columnWidths2, '3. เอกสารยืนยันขอบเขต');
    drawCell2(40 + columnWidths2 + 10, 150 + lineHeights2 * 2, columnWidths2, 'Cell 3,2');
    
     
    doc.addPage();  
    doc.fontSize(20).text('3.1.1 โครงสร้างขององค์กร', { align: 'left' });
     ShowData.forEach((item) => {
        item.faculties.forEach((fac) => {
            fac.activityperiods.forEach(period => {
                period.image_files.forEach((image_file) => {
                    if(image_file.type_fr === '2'){
                            doc.image(`uploads/${image_file.file_name}`, {
                            fit: [530, 300], // Fit the image into the specified dimensions
                            align: 'center', // Align the image to the center of the rectangle
                            valign: 'center', // Vertically align the image to the center of the rectangle
                            x: 40, // X-coordinate of the image
                            y: 120 // Y-coordinate of the image
                        });
                    }
                });
            });
        });
    });
    
     //หน้าที่3
     doc.addPage();
     doc.fontSize(20).text('3.1.2 แผนผังขององค์กร', 20, 100);
     ShowData.forEach((item) => {
        item.faculties.forEach((fac) => {
            fac.activityperiods.forEach(period => {
                period.image_files.forEach((image_file) => {
                    if(image_file.type_fr === '3'){
                            doc.image(`uploads/${image_file.file_name}`, {
                            fit: [530, 300], // Fit the image into the specified dimensions
                            align: 'center', // Align the image to the center of the rectangle
                            valign: 'center', // Vertically align the image to the center of the rectangle
                            x: 40, // X-coordinate of the image
                            y: 120 // Y-coordinate of the image
                        });
                    }
                });
            });
        });
    });

    //หน้า4
     doc.addPage();
    


     //หน้า5
     doc.addPage();
     doc.fontSize(20).text('3.1.4 ระบุกิจกรรมทั้งหมดขององค์กร', 20, 100);

      //หน้า6
      doc.addPage();
      doc.fontSize(20).text(`3.1.5 ระบุขอบเขตขององค์กรที่เพิ่มเข้ามาหรือขอบเขตที่ไม่รวม (ระบุ Facility) ที่เพิ่มเข้ามาหรือไม่นับรวม พร้อมเหตุผล`, 20, 100);


       //หน้า7
     doc.addPage();
     doc.fontSize(20).text('3.2 ขอบเขตการดำเนินงาน', 20, 100);

      //หน้า8
      doc.addPage();
      doc.fontSize(20).text('4.สรุปปริมาณการปล่อยก๊าซเรือนกระจก', 20, 100);
      doc.fontSize(18).text(' 4.1 การปล่อยก๊าซเรือนกระจก จากขอบเขตการดำเนินงานประเภทที่ 1');
     

       //หน้า9
     doc.addPage();
     doc.fontSize(20).text('4.2 การปล่อยก๊าซเรือนกระจก จากขอบเขตการดำเนินงานประเภทที่ 2', 20, 100);

      //หน้า10
      doc.addPage();
      doc.fontSize(20).text('4.3 การปล่อยก๊าซเรือนกระจก จากขอบเขตการดำเนินงานประเภทที่ 3', 20, 100);

       //หน้า11
     doc.addPage();
     doc.fontSize(20).text('4.4 Carbon Intensity', 20, 100);

   /*   doc.image('uploads/1710989446227-scope1.png') */
    // ปิดเอกสาร PDF 
    doc.end();

});


// api สมบูรณ์พร้อมupload  ทำ API  ก็ได้  รายงานของแต่ละตัวก้ได้ 
/**
 * @swagger
 * /test101:
 *   get:
 *     summary: Retrieve data for test101
 *     description: Retrieve formatted data for test101.
 *     tags:
 *       - Test Endpoints
 *     responses:
 *       200:
 *         description: Successfully retrieved data for test101
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test101Data'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Test101Data:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The campus ID.
 *         campus_name:
 *           type: string
 *           description: The name of the campus.
 *         faculties:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FacultyData'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FacultyData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The faculty ID.
 *         fac_name:
 *           type: string
 *           description: The name of the faculty.
 *         activityperiods:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ActivityPeriodData'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityPeriodData:
 *       type: object
 *       properties:
 *         years:
 *           type: integer
 *           description: The years of the activity period.
 *         scopenums:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ScopeNumData'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ScopeNumData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the scope.
 *         headcategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HeadCategoryData'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HeadCategoryData:
 *       type: object
 *       properties:
 *         head_id:
 *           type: integer
 *           description: The head category ID.
 *         head_name:
 *           type: string
 *           description: The name of the head category.
 *         data_scopes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataScopeData'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DataScopeData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the data scope.
 *         lci:
 *           type: string
 *           description: The lci value.
 *         tCO2e:
 *           type: number
 *           description: The tCO2e value.
 */

app.get('/test101', async (req, res) => {
    try {
        const query = `
            SELECT 
                campuses.id AS campus_id,
                campus_name,
                faculties.id AS fac_id,
                fac_name,
                years,
                catescopenums.name AS scope_name,
                headcategories.id as head_id,
                headcategories.head_name,
                data_scopes.name,
                lci,
                SUM((quantity * (
                                (kgCO2e)  +
                                (CO2 * gwp_CO2) + 
                                (Fossil_CH4 * gwp_Fossil_CH4) + 
                                (CH4 * gwp_CH4) + 
                                (N2O * gwp_N2O) + 
                                (SF6 * gwp_SF6) + 
                                (NF3 * gwp_NF3) + 
                                (HFCs * GWP_HFCs) + 
                                (PFCs * GWP_PFCs)
                              )) / 1000) AS tCO2e
            FROM 
                data_scopes 
                INNER JOIN activityperiods ON data_scopes.activityperiod_id = activityperiods.id 
                INNER JOIN gwps ON data_scopes.GWP_id = gwps.id  
                INNER JOIN faculties ON activityperiods.fac_id = faculties.id
                INNER JOIN campuses ON faculties.campus_id = campuses.id
                INNER JOIN headcategories ON data_scopes.head_id = headcategories.id
                INNER JOIN catescopenums ON headcategories.scopenum_id = catescopenums.id
            GROUP BY
                campus_id,
                fac_id,
                activityperiods.id,
                years,
                catescopenums.name,
                headcategories.head_name,
                data_scopes.name,
                lci`;

        const data = await conn.query(query, { type: QueryTypes.SELECT });

        const formattedData = [];
        let currentCampusId = null;
        let currentFacId = null;
        let currentActivityPeriodId = null;
        let campus = null;
        let faculty = null;
        let activityPeriod = null;

        data.forEach(item => {
            if (item.campus_id !== currentCampusId) {
                currentCampusId = item.campus_id;
                campus = {
                    id: currentCampusId,
                    campus_name: item.campus_name,
                    faculties: []
                };
                formattedData.push(campus);
                currentFacId = null;
            }

            if (item.fac_id !== currentFacId) {
                currentFacId = item.fac_id;
                faculty = {
                    id: currentFacId,
                    fac_name: item.fac_name,
                    activityperiods: []
                };
                campus.faculties.push(faculty);
                currentActivityPeriodId = null;
            }

            if (item.years !== currentActivityPeriodId) {
                currentActivityPeriodId = item.years;
                activityPeriod = {
                    years: item.years,
                    scopenums: []
                };
                faculty.activityperiods.push(activityPeriod);
            }

            const scopeIndex = activityPeriod.scopenums.findIndex(scope => scope.name === item.scope_name);
            if (scopeIndex === -1) {
                activityPeriod.scopenums.push({
                    name: item.scope_name,
                    headcategories: [
                        {
                            head_id: item.head_id,
                            head_name: item.head_name,
                           
                            data_scopes: [
                                {
                                    name: item.name,
                                    lci: item.lci,
                                    tCO2e: item.tCO2e
                                }
                            ]
                        }
                    ]
                });
            } else {
                const headIndex = activityPeriod.scopenums[scopeIndex].headcategories.findIndex(head => head.head_name === item.head_name);
                if (headIndex === -1) {
                    activityPeriod.scopenums[scopeIndex].headcategories.push({
                        head_id: item.head_id,
                        head_name: item.head_name,
                        data_scopes: [
                            {
                                name: item.name,
                                lci: item.lci,
                                tCO2e: item.tCO2e
                            }
                        ]
                    });
                } else {
                    activityPeriod.scopenums[scopeIndex].headcategories[headIndex].data_scopes.push({
                        name: item.name,
                        lci: item.lci,
                        tCO2e: item.tCO2e
                    });
                }
            }
        });

        // เรียงลำดับ headcategories ตาม head_id จากน้อยไปมาก
        formattedData.forEach(campus => {
            campus.faculties.forEach(faculty => {
                faculty.activityperiods.forEach(activityPeriod => {
                    activityPeriod.scopenums.forEach(scope => {
                        scope.headcategories.sort((a, b) => a.head_id - b.head_id);
                    });
                });
            });
        });

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/test202',async(req,res)=>{
    try{
        const ShowData = await CampusModels.findAll(
            {
                attributes:['id','campus_name'],
                where:{
                    id:'MH'
                },
                include:[
                    {
                        model:PlaceCmuModels,
                        attributes:['id','fac_name'],
                        where:{
                            id:'MH2009'
                        },
                        include:[
                            {
                                model:ActivityGHGModel,
                                attributes:['years'],
                                where:{
                                    years:2023
                                },
                                include:[
                                    {
                                        model:ImageFileModel,
                                        attributes:['type_fr','file_name']
                                    },
                                    {
                                        model:ReportModel,
                                        attributes:['intro','tester','coordinator','responsible','monitor','assurance','materially','explanation','cfo_operation1','cfo_operation2','cfo_operation3','image_name']

                                    }
                                    
                                ]
                            }
                        ]
                    }
                ]
            }
        )
        res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});

module.exports = app