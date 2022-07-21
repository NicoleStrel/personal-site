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
        };
        this.flipCard = this.flipCard.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    flipCard(e){
        let flipped_dict = this.state.flipped
        flipped_dict[e] = flipped_dict[e] ? !flipped_dict[e] : true;
        this.setState({ flipped: flipped_dict});
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
    getProjBlock(i, dataItem){
        return  (<ProjBlock 
                    key={i} 
                    title={dataItem.title} 
                    subheader={dataItem.subheader} 
                    date={dataItem.date} 
                    img={dataItem.img} 
                    desc={dataItem.desc}
                    flipped={this.state.flipped}
                    onFlip={this.flipCard}
                    ></ProjBlock>)
    }
    
    render() {
        const flipped = this.state.flipped
        return (
            <div className="split dynamicRight"> 
                <div className="container">
                    <h1 className="experience">Experience</h1>
                    {this.state.dataExp.map(function(dataItem, i){
                        return <ExpBlock key={i} title={dataItem.title} company={dataItem.company} link={dataItem.link}  dates={dataItem.dates} description={dataItem.description}></ExpBlock>
                    })}
                    <h1 className="projects">Projects</h1>
                    <div className="proj-container">
                        {this.state.dataProj.map((dataItem, i) =>
                            <ProjBlock 
                                key={i} 
                                i={i}
                                title={dataItem.title} 
                                subheader={dataItem.subheader} 
                                date={dataItem.date} 
                                img={dataItem.img}
                                github={dataItem.github}
                                link={dataItem.link}
                                desc={dataItem.desc}
                                flipped={this.state.flipped[i]}
                                onFlip={this.flipCard}
                            ></ProjBlock>
                        )}
                    </div>
                </div>
            </div>
            
        )
    }

}

export default DynamicRight