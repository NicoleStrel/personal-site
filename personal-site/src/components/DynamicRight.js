import React from 'react';
import "../style/DynamicRight.css";
import "../style/App.css";
import ExpBlock from './ExpBlock';
import ProjBlock from './ProjBlock';
import expcsv from '../data/experience.csv';
import projcsv from '../data/projects.csv';
import Papa from 'papaparse';

class DynamicRight extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataExp: [],
            dataProj: [],
            flipped: {},
            finishedflip: true,
        };
        this.flipCard = this.flipCard.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    flipCard(e){
        if (this.state.finishedflip){
            this.setState({ finishedflip: false});
            let flipped_dict = this.state.flipped
            flipped_dict[e] = flipped_dict[e] ? !flipped_dict[e] : true;
            this.setState({ flipped: flipped_dict});
            this.setState({ finishedflip: true});
        }
    }

    updateData(input, type){
        var data = []
        const records = input.data;
        const categories=records[0]
        if (records){
            for (let i=1; i<records.length; i++){
                let dataItem={}
                for (let j=0; j<categories.length; j++){
                    dataItem[categories[j]] = records[i][j]
                }
                data.push(dataItem)
            }
        } 
        if (type.includes("experience")){
            this.setState({ dataExp: data});
        } else {
            this.setState({ dataProj: data});
        }
    }

    parseCSV(expcsv, type){
        Papa.parse(expcsv, {
            download: true,
            complete: this.updateData,
        });
    }
    
    componentDidMount() {
        this.parseCSV(expcsv, "exp");
        this.parseCSV(projcsv, "proj");
    }
    
    render() {
        return (
            <div className="split dynamicRight"> 
                <div className="container">
                    <h1 className="experience">Experience</h1>
                    {this.state.dataExp.map(function(dataItem, i){
                        return <ExpBlock 
                                    key={i} 
                                    img = {dataItem.img}
                                    title={dataItem.title} 
                                    company={dataItem.company} 
                                    link={dataItem.link}  
                                    location={dataItem.location}
                                    dates={dataItem.dates} 
                                    description={dataItem.description} 
                                    delay={i/2}></ExpBlock>
                    })}
                    <div className="projects">
                        <h1 className="proj-text">Projects</h1>
                        <div className="proj-container">
                            {this.state.dataProj.map((dataItem, i) =>
                                <ProjBlock 
                                    key={i} 
                                    i={i}
                                    title={dataItem.title} 
                                    subheader={dataItem.subheader} 
                                    date={dataItem.date} 
                                    img={dataItem.img}
                                    desc={dataItem.desc}
                                    github={dataItem.github}
                                    link={dataItem.link}
                                    youtube={dataItem.youtube}
                                    devpost={dataItem.devpost}
                                    flipped={this.state.flipped[i]}
                                    onFlip={this.flipCard}
                                    delay={i/2}
                                ></ProjBlock>
                            )}
                        </div>
                    </div>
                    <p className="copyright"> © 2024 Copyright Nicole Streltsov</p>
                </div>
            </div>
            
        )
    }

}

export default DynamicRight