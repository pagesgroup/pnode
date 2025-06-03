# Flow

1. PLT > PNode: JobChange
    1. Controleer, fout als JobID <> JobID PNode
1. PNode > PLT: JobInfo




# Pnode > PLT: JobInfo

1. JobIDCurrent (40):
1. DesiredYieldCurrent (8):
1. MaterialID (40):
1. LBLNAME (120):
1. LBLBARCODECurrent (40):
1. IMLBARCODECurrent (40):
1. IMLBARCODELOCCurrent (4):
1. JobIDNext (40):
1. LBLBARCODENext (40):
1. IMLBARCODENext (40):
1. IMLBARCODELOCNext (4):
1. DesiredYieldNext (8):
1. DateTime (16):

# Pnode > PLT: ?

1. ErrorCode (?)
1. ErrorMessage (?)
1. JobID (40): Polymac New
1. JobRun (?): Polymac New
1. JobID (40): Aspect expected
1. JobRun (?): Aspect expected

# Box Packing > Label Printer

1. MaterialID (40):
1. LBLBARCODE
1. LBLNAME
1. BoxQtyActual
1. DateTime


# PLT > Pnode: JobChange

1. jobChange
    1. JobID
    1. DataCount


# Protocol

1. PLT
    1. Jobchange
    1. Rejects
1. BoxStacker
    1. FinishedCart
    1. RequestBoxInfo

1. MessageName:24 caracters
    1. Opgebouwd uit naam bericht, afgesloten met :
    1. Voorbeeld: `Jobchange             no:`
    1. Voorbeeld: `Rejects               no:`
    1. Voorbeeld: `RequestBoxInfo        no:`
    1. Voorbeeld: `FinishedCart          no:`
    1. Voorbeeld: `FinishedCart no:2       `
    1. `FinishedCart no:2       `
1. Verzenden
    1.


JobInfo


`Job:`


Timestamp: YYYYMMDD_HHMMSS

1. jobchange        : `JobChange    no:5       62514-C310M-HDWHIML-A181`
1. request box info : `REQUESTBOXINFO          62514-C310M-HDWHIML-A181`
1. finished cart    : `FinishedCart no:4       62514-C310M-HDWHIML-A181...`
1. rejects          : `Rejects :    no:12      62514-C310M-HDWHIML-A181`

1. rejects          : `Rejects :    no:12      62514-C310M-HDWHIML-A181`


