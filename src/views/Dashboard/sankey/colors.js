
import Cookies from "universal-cookie";
import i18n from '~/i18n';
const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData = i18n.logger.options.resources[language].translation.componentData.reduxData;


export const getStatusColorToPoint = (point) => {
    const toName = point && point["toNode"] && point["toNode"]["id"];
    switch (toName) {
        case translatedData["Approved"]:
            return "#264D88";
        case translatedData["Pending Profile Creation"]:
            return "#FAE951";
        case translatedData["Pending Profile Confirmation"]:
            return "#FAE951";
        case translatedData["Pending Profile Completion"]:
            return "#FAE951";
        case translatedData["Pending Approval"]:
            return "#68BBF1";
        case translatedData["Pending Validation"]:
            return "#68BBF1";
        case translatedData["Unable To Validate"]:
            return "#FFA083";
        case translatedData["Disapproved"]:
            return "#FFA083";
        case translatedData["Revoked"]:
            return "#FFA083";

        case translatedData["ACH"]:
            return "#269BE7";
        case translatedData["Cross Border"]:
            return "#497E99";
        case translatedData["Wire"]:
            return "#78A4BD";
        case translatedData["Check"]:
            return "#D2E7FE";
        case translatedData["VCA"]:
            case translatedData["Virtual C"]:
            return "#3DB8B1";
        default:
            return point.toNode.color;
    }
};

export const getStatusColorFromPoint = (point) => {
    const fromName = point && point["fromNode"] && point["fromNode"]["id"];
    switch (fromName) {
        case translatedData["Approved"]:
            return "#264D88";
        case translatedData["Pending Profile Creation"]:
            return "#FAE951";
        case translatedData["Pending Profile Confirmation"]:
            return "#FAE951";
        case translatedData["Pending Profile Completion"]:
            return "#FAE951";
        case translatedData["Pending Approval"]:
            return "#68BBF1";
        case translatedData["Pending Validation"]:
            return "#68BBF1";
        case translatedData["Unable To Validate"]:
            return "#FFA083";
        case translatedData["Disapproved"]:
            return "#FFA083";
        case translatedData["Revoked"]:
            return "#FFA083";
        default:
            return point.toNode.color;
    }
};

export const getNodeColor = (point) => {
    const color = point.color;
    const id = point.id;
    switch (id) {
        case translatedData["Approved"]:
            return "#264D88";
        case translatedData["Pending Profile Creation"]:
            return "#FAE951";
        case translatedData["Pending Profile Confirmation"]:
            return "#FAE951";
        case translatedData["Pending Profile Completion"]:
            return "#FAE951";
        case translatedData["Pending Approval"]:
            return "#68BBF1";
        case translatedData["Pending Validation"]:
            return "#68BBF1";
        case translatedData["Unable To Validate"]:
            return "#FFA083";
        case translatedData["Disapproved"]:
            return "#FFA083";
        case translatedData["Revoked"]:
            return "#FFA083";

        case translatedData["ACH"]:
            return "#269BE7";
        case translatedData["Cross Border"]:
            return "#497E99";
        case translatedData["Wire"]:
            return "#78A4BD";
        case translatedData["Check"]:
            return "#D2E7FE";
            case translatedData["VCA"]:
        case translatedData["Virtual C"]:
            return "#3DB8B1";
        default:
            return color;
    }
};