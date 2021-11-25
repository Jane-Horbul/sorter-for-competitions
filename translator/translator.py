import sys
import os
import shutil
from openpyxl import load_workbook

MAX_LANG_NUM = 10

def readFile(path):
    with open(path, "rt") as f:
        text = f.read()
        return text

def writeFile(path, text):
    with open(path, "w") as f:
        text = f.write(text)

def copyLangFolders(langs, dst, src):
    for lang in langs:
        print(lang)
        dstFolder = dst + "/" + lang
        if os.path.exists(dstFolder):
            shutil.rmtree(dstFolder)
        shutil.copytree(src, dstFolder, 1024*1024)

def getLangs(wb):
    sheets = wb.get_sheet_names()
    sheet = wb.get_sheet_by_name(sheets[0])
    langs = []
    for i in range(2, MAX_LANG_NUM):
        lang = sheet.cell(row=1, column=i).value
        if lang == None:
            break
        langs.append(lang)
    return langs
  

def fileTranslate(fileText, fileSheet, commonSheet, dst):
    originColNum = 0
    for i in range(1, MAX_LANG_NUM):
        if fileSheet.cell(row=1, column=i).value == "origin":
            originColNum = i
            break
    
    colNum = 1
    while fileSheet.cell(row=1, column=colNum).value != None:
        if colNum != originColNum:
            curLang = fileSheet.cell(row=1, column=colNum).value
            writePath = dst.format(lang=curLang)
            langText = fileText
            print(writePath)
            
            rowNum = 1
            word = commonSheet.cell(row=rowNum, column=colNum).value
            while word != None:
                originWord = commonSheet.cell(row=rowNum, column=originColNum).value
                langText = langText.replace(originWord, word)
                rowNum += 1
                word = commonSheet.cell(row=rowNum, column=colNum).value
            rowNum = 1
            word = fileSheet.cell(row=rowNum, column=colNum).value
            while word != None:
                originWord = fileSheet.cell(row=rowNum, column=originColNum).value
                langText = langText.replace(originWord, word)
                rowNum += 1
                word = fileSheet.cell(row=rowNum, column=colNum).value
            writeFile(writePath, langText)
        colNum += 1

def translateAll(wb, src, dst):
    filesNames = wb.get_sheet_names()
    langs = getLangs(wb)
    copyLangFolders(langs, dst, src)
    commonSheet = None

    for flName in filesNames:
        if flName == "common":
            commonSheet = wb.get_sheet_by_name(flName)
            break

    for flName in filesNames:
        if flName == "common":
            continue
        destFile = dst + "/{lang}/" + flName
        sheet = wb.get_sheet_by_name(flName)
        flText = readFile(src + "/" + flName)
        fileTranslate(flText, sheet, commonSheet, destFile)

def main():
    wb = load_workbook('./dictionary.xlsx')
    translateAll(wb, "../", "../../langs")
    print("Done!")
    
main()
