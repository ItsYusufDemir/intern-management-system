import { Team } from "./Team";

export class Intern {
    photoUrl: string;
    name: string;
    lastName: string;
    fullName: string;
    id: string;
    tel: string;
    uni: string;
    major: string;
    grade: number;
    gpa: number;
    team: Team;
    internshipStartingDate: Date;
    internshipEndingDate: Date;
    cvUrl: string;
    başarıPuanı: number[];

    constructor(
        photoUrl: string,
        name: string,
        lastName: string,
        id: string,
        tel: string,
        uni: string,
        major: string,
        grade: number,
        gpa: number,
        team: Team,
        internshipStartingDate: Date,
        internshipEndingDate: Date,
        cvUrl: string,
      ) {
        this.photoUrl = photoUrl;
        this.name = name;
        this.lastName = lastName;
        this.id = id;
        this.tel = tel;
        this.uni = uni;
        this.major = major;
        this.grade = grade;
        this.gpa = gpa;
        this.team = team;
        this.internshipStartingDate = internshipStartingDate;
        this.internshipEndingDate = internshipEndingDate;
        this.cvUrl = cvUrl;
        this.fullName = this.name + " " + this.lastName;
        this.başarıPuanı = [];
      }
}


