# 📑 Interface Specification: Communication between Aspect and Polymac System

## 📂 Folder Structure

The agreed folder structure for file exchange between the Polymac system and Aspect is shown below. Further in this document, you’ll find actions detailing how and when these folders are used.

```
C:\Polymac\
C:\Polymac\ErrorInfo
C:\Polymac\ErrorInfo\Error
C:\Polymac\ErrorInfo\Processed
C:\Polymac\FinishedCartons
C:\Polymac\Rejects
C:\Polymac\JobChange
C:\Polymac\JobInfo
C:\Polymac\JobInfo\Error
C:\Polymac\JobInfo\Processed
C:\Polymac\Logging
```

## 📥 Received Batch Data

The following describes how data sent from Aspect is handled, and what Aspect expects in return:

1. **Aspect places a file named `BatchData.csv` in `C:\Polymac\JobInfo`.**
2. The PC reads and validates the CSV file:
   - **Invalid Data:**
     - Valid data is extracted and processed.
     - The original `BatchData.csv` is moved to `C:\Polymac\JobInfo\Error` and renamed to `BatchData_YYYYMMDD_HHMM.csv`.
   - **Valid Data:**
     - The data is read and stored locally.
     - The `BatchData.csv` file is moved to `C:\Polymac\JobInfo\Processed` with the same timestamped name format.

### 📑 BatchData.csv Structure

| Col. | Item            | Purpose                                 | Where used                      | Max Field Length | PLC Field Length |
|:-----|:----------------|:------------------------------------------|:----------------------------------|:----------------|:----------------|
| 1    | JobId           | Job control                              | Communication between Aspect and PC | 40             | 40             |
| 2    | JobRun          | Job control                              | Communication between Aspect and PC | 3              | -              |
| 3    | DesiredYield    | Number of products to be produced        | Batch control in PLT               | 8              | 8              |
| 4    | MaterialID      | Name printed on label                    | Printer in box packing             | 30             | 40             |
| 5    | ScheduleIndex   | Production sequence                      | Used to order the Jobs             | 3              | 8              |
| 6-21 | [Various Fields] | Refer to original document               | See original table                 | See original   | See original   |

## 📤 Active Job (JobChange)

When the active job changes on the machine (PLT), this is communicated to Aspect via a file:

1. **Active job changes in the PLC.**
2. **PC creates a file `JobChange.csv` with timestamp (`JobChange_YYYYMMDD_HHMM.csv`).**
3. **File is placed in `C:\Polymac\FinishedCartons`.**
4. **Aspect reads and processes this file.**

### 📑 JobChange.csv Structure

- Timestamp of job change  
- New Job ID  
- New Job Run  
- New Work Order ID  
- Machine ID  

## 📉 Rejects

Rejected products are logged and communicated to Aspect:

1. **Product is rejected.**
2. **PC generates `Rejects.csv` with timestamp (`Rejects_YYYYMMDD_HHMM.csv`).**
3. **File is placed in `C:\Polymac\Rejects`.**
4. **Aspect reads and processes this file.**

### 📑 Rejects.csv Structure

- Job ID  
- Job Run  
- Timestamp  
- Reject Reason Code  
  - Counter Label Check  
  - Counter Vacuum Check (later implementation)  
  - Counter Camera Check  
- Work Order ID  
- Machine ID  

## 📦 Finished Cartons

Finished boxes and product counts are communicated as follows:

1. **Box is filled and completed.**
2. **PC generates `FinishedCartons.csv` with timestamp.**
3. **File is placed in `C:\Polymac\FinishedCartons`.**
4. **Aspect reads and processes this file.**

## ⚠️ Error Messages from Aspect

If production scheduling is interrupted (e.g. lost network, Aspect server down), the machine continues with the existing schedule. The application tracks completed jobs not yet removed from the queue. Once the Aspect service resumes:

- PacQ checks the requested order against completed jobs.
- If a new Job ID sent by Polymac does not match the next job in Aspect’s queue, an error file is generated and sent to Polymac.

**Error files are placed by Aspect in `C:\Polymac\ErrorInfo`.**  
Polymac then processes these:
- If successfully handled → move to `C:\Polymac\ErrorInfo\Processed`
- If failed → move to `C:\Polymac\ErrorInfo\Error`

### 📑 Error Message File Structure

- Error Code (e.g., 1000 = JobChange failure)
- Error Message (max 255 characters)
- Timestamp of error
- Polymac New Job ID
- Polymac New Job Run
- Aspect Expected Job ID
- Aspect Expected Job Run  

## 🌐 System IP Addresses & Ports

_To be defined and listed here_

## 📡 System Communication Overview

_To be detailed in a communication flow diagram if applicable_

## ✅ Summary

This specification outlines the directory structure, data exchange processes, file formats, and error handling protocol for the integration between Aspect and the Polymac system.
